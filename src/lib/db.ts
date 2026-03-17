import { createClient } from "./supabase";
import { Interest, ChatMessage, Course, CourseWeek, CourseTask, Creator, QuickReply } from "@/types";

const supabase = createClient();

// ============================================================================
// INTERESTS
// ============================================================================

export async function fetchInterests(userId: string): Promise<Interest[]> {
  const { data: interestsData, error } = await supabase
    .from("interests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!interestsData) return [];

  const interests: Interest[] = [];

  for (const row of interestsData) {
    // Fetch messages for this interest
    const { data: messagesData } = await supabase
      .from("messages")
      .select("*")
      .eq("interest_id", row.id)
      .order("created_at", { ascending: true });

    const messages: ChatMessage[] = (messagesData || []).map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant",
      content: m.content,
      timestamp: new Date(m.created_at),
      quickReplies: m.quick_replies as QuickReply[] | undefined,
      creators: m.creators as Creator[] | undefined,
      courseUpdate: m.course_update as CourseWeek[] | undefined,
    }));

    // Fetch course if exists
    let course: Course | null = null;
    const { data: courseData } = await supabase
      .from("courses")
      .select("*")
      .eq("interest_id", row.id)
      .limit(1)
      .single();

    if (courseData) {
      const { data: weeksData } = await supabase
        .from("course_weeks")
        .select("*")
        .eq("course_id", courseData.id)
        .order("week_number", { ascending: true });

      const weeks: CourseWeek[] = [];
      for (const w of weeksData || []) {
        const { data: tasksData } = await supabase
          .from("course_tasks")
          .select("*")
          .eq("week_id", w.id)
          .order("sort_order", { ascending: true });

        weeks.push({
          weekNumber: w.week_number,
          title: w.title,
          description: w.description,
          unlocked: w.unlocked,
          resources: (w.resources as Course["weeks"][0]["resources"]) || [],
          tasks: (tasksData || []).map((t) => ({
            id: t.task_id_client,
            label: t.label,
            description: t.description || undefined,
            completed: t.completed,
            type: t.type as CourseTask["type"],
          })),
        });
      }

      course = {
        title: courseData.title,
        description: courseData.description,
        totalWeeks: courseData.total_weeks,
        currentWeek: courseData.current_week,
        weeks,
        generatedAt: new Date(courseData.created_at),
      };
    }

    interests.push({
      id: row.id,
      name: row.name,
      emoji: row.emoji,
      messages,
      progress: [],
      course,
      onboarding: { completed: row.onboarding_completed, answers: [] },
      createdAt: new Date(row.created_at),
    });
  }

  return interests;
}

export async function createInterest(
  userId: string,
  name: string,
  emoji: string
): Promise<string> {
  const { data, error } = await supabase
    .from("interests")
    .insert({ user_id: userId, name, emoji })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function deleteInterest(interestId: string): Promise<void> {
  const { error } = await supabase
    .from("interests")
    .delete()
    .eq("id", interestId);

  if (error) throw error;
}

export async function updateInterestOnboarding(
  interestId: string,
  completed: boolean
): Promise<void> {
  const { error } = await supabase
    .from("interests")
    .update({ onboarding_completed: completed })
    .eq("id", interestId);

  if (error) throw error;
}

// ============================================================================
// MESSAGES
// ============================================================================

export async function saveMessage(
  interestId: string,
  message: ChatMessage
): Promise<string> {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      interest_id: interestId,
      role: message.role,
      content: message.content,
      quick_replies: message.quickReplies ? JSON.parse(JSON.stringify(message.quickReplies)) : null,
      creators: message.creators ? JSON.parse(JSON.stringify(message.creators)) : null,
      course_update: message.courseUpdate ? JSON.parse(JSON.stringify(message.courseUpdate)) : null,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateMessage(
  messageId: string,
  updates: {
    content?: string;
    quickReplies?: QuickReply[];
    creators?: Creator[];
    courseUpdate?: CourseWeek[];
  }
): Promise<void> {
  const updateData: Record<string, unknown> = {};
  if (updates.content !== undefined) updateData.content = updates.content;
  if (updates.quickReplies !== undefined) updateData.quick_replies = JSON.parse(JSON.stringify(updates.quickReplies));
  if (updates.creators !== undefined) updateData.creators = JSON.parse(JSON.stringify(updates.creators));
  if (updates.courseUpdate !== undefined) updateData.course_update = JSON.parse(JSON.stringify(updates.courseUpdate));

  const { error } = await supabase
    .from("messages")
    .update(updateData)
    .eq("id", messageId);

  if (error) throw error;
}

// ============================================================================
// COURSES
// ============================================================================

export async function saveCourse(
  interestId: string,
  course: {
    title: string;
    description: string;
    totalWeeks: number;
    weeks: CourseWeek[];
  }
): Promise<string> {
  // Insert course
  const { data: courseData, error: courseError } = await supabase
    .from("courses")
    .insert({
      interest_id: interestId,
      title: course.title,
      description: course.description,
      total_weeks: course.totalWeeks,
      current_week: 1,
    })
    .select("id")
    .single();

  if (courseError) throw courseError;
  const courseId = courseData.id;

  // Insert weeks and tasks
  for (const week of course.weeks) {
    await saveWeekWithTasks(courseId, week);
  }

  return courseId;
}

async function saveWeekWithTasks(courseId: string, week: CourseWeek): Promise<void> {
  const { data: weekData, error: weekError } = await supabase
    .from("course_weeks")
    .insert({
      course_id: courseId,
      week_number: week.weekNumber,
      title: week.title,
      description: week.description,
      unlocked: week.unlocked,
      resources: week.resources ? JSON.parse(JSON.stringify(week.resources)) : null,
    })
    .select("id")
    .single();

  if (weekError) throw weekError;

  if (week.tasks.length > 0) {
    const taskInserts = week.tasks.map((t, idx) => ({
      week_id: weekData.id,
      task_id_client: t.id,
      label: t.label,
      description: t.description || null,
      type: t.type,
      completed: t.completed,
      sort_order: idx,
    }));

    const { error: tasksError } = await supabase
      .from("course_tasks")
      .insert(taskInserts);

    if (tasksError) throw tasksError;
  }
}

export async function addWeeksToCourse(
  courseId: string,
  weeks: CourseWeek[]
): Promise<void> {
  for (const week of weeks) {
    await saveWeekWithTasks(courseId, week);
  }
}

export async function updateCourseCurrentWeek(
  interestId: string,
  currentWeek: number
): Promise<void> {
  const { error } = await supabase
    .from("courses")
    .update({ current_week: currentWeek })
    .eq("interest_id", interestId);

  if (error) throw error;
}

export async function unlockWeek(
  courseId: string,
  weekNumber: number
): Promise<void> {
  const { error } = await supabase
    .from("course_weeks")
    .update({ unlocked: true })
    .eq("course_id", courseId)
    .eq("week_number", weekNumber);

  if (error) throw error;
}

// ============================================================================
// TASKS
// ============================================================================

export async function toggleTaskCompletion(
  weekId: string,
  taskIdClient: string,
  completed: boolean
): Promise<void> {
  // We need to find the task by week_id + task_id_client since we store the client ID
  const { error } = await supabase
    .from("course_tasks")
    .update({ completed })
    .eq("week_id", weekId)
    .eq("task_id_client", taskIdClient);

  if (error) throw error;
}

// Helper to get the DB week ID from course_id + week_number
export async function getWeekId(
  courseId: string,
  weekNumber: number
): Promise<string | null> {
  const { data, error } = await supabase
    .from("course_weeks")
    .select("id")
    .eq("course_id", courseId)
    .eq("week_number", weekNumber)
    .single();

  if (error) return null;
  return data.id;
}

// Helper to get course DB ID from interest_id
export async function getCourseId(interestId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("courses")
    .select("id")
    .eq("interest_id", interestId)
    .limit(1)
    .single();

  if (error) return null;
  return data.id;
}
