import { createClient } from "./supabase";
import { Interest, ChatMessage, Course, CourseWeek, CourseTask, Creator, QuickReply } from "@/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

function db() {
  return createClient();
}

// ============================================================================
// INTERESTS
// ============================================================================

export async function fetchInterests(userId: string): Promise<Interest[]> {
  const { data: interestsData, error } = await db()
    .from("interests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!interestsData) return [];

  const interests: Interest[] = [];

  for (const row of interestsData as any[]) {
    const { data: messagesData } = await db()
      .from("messages")
      .select("*")
      .eq("interest_id", row.id)
      .order("created_at", { ascending: true });

    const messages: ChatMessage[] = ((messagesData || []) as any[]).map((m: any) => ({
      id: m.id,
      role: m.role as "user" | "assistant",
      content: m.content,
      timestamp: new Date(m.created_at),
      quickReplies: m.quick_replies as QuickReply[] | undefined,
      creators: m.creators as Creator[] | undefined,
      courseUpdate: m.course_update as CourseWeek[] | undefined,
    }));

    let course: Course | null = null;
    const { data: courseData } = await db()
      .from("courses")
      .select("*")
      .eq("interest_id", row.id)
      .limit(1)
      .maybeSingle();

    if (courseData) {
      const cd = courseData as any;
      const { data: weeksData } = await db()
        .from("course_weeks")
        .select("*")
        .eq("course_id", cd.id)
        .order("week_number", { ascending: true });

      const weeks: CourseWeek[] = [];
      for (const w of ((weeksData || []) as any[])) {
        const { data: tasksData } = await db()
          .from("course_tasks")
          .select("*")
          .eq("week_id", w.id)
          .order("sort_order", { ascending: true });

        weeks.push({
          weekNumber: w.week_number,
          title: w.title,
          description: w.description,
          unlocked: w.unlocked,
          resources: (w.resources as CourseWeek["resources"]) || [],
          tasks: ((tasksData || []) as any[]).map((t: any) => ({
            id: t.task_id_client,
            label: t.label,
            description: t.description || undefined,
            completed: t.completed,
            type: t.type as CourseTask["type"],
          })),
        });
      }

      course = {
        title: cd.title,
        description: cd.description,
        totalWeeks: cd.total_weeks,
        currentWeek: cd.current_week,
        weeks,
        generatedAt: new Date(cd.created_at),
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
  const { data, error } = await db()
    .from("interests")
    .insert({ user_id: userId, name, emoji } as any)
    .select("id")
    .single();

  if (error) throw error;
  return (data as any).id;
}

export async function deleteInterest(interestId: string): Promise<void> {
  const { error } = await db()
    .from("interests")
    .delete()
    .eq("id", interestId);

  if (error) throw error;
}

export async function updateInterestOnboarding(
  interestId: string,
  completed: boolean
): Promise<void> {
  const { error } = await db()
    .from("interests")
    .update({ onboarding_completed: completed } as any)
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
  const { data, error } = await db()
    .from("messages")
    .insert({
      interest_id: interestId,
      role: message.role,
      content: message.content,
      quick_replies: message.quickReplies ? JSON.parse(JSON.stringify(message.quickReplies)) : null,
      creators: message.creators ? JSON.parse(JSON.stringify(message.creators)) : null,
      course_update: message.courseUpdate ? JSON.parse(JSON.stringify(message.courseUpdate)) : null,
    } as any)
    .select("id")
    .single();

  if (error) throw error;
  return (data as any).id;
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

  const { error } = await db()
    .from("messages")
    .update(updateData as any)
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
  const { data: courseData, error: courseError } = await db()
    .from("courses")
    .insert({
      interest_id: interestId,
      title: course.title,
      description: course.description,
      total_weeks: course.totalWeeks,
      current_week: 1,
    } as any)
    .select("id")
    .single();

  if (courseError) throw courseError;
  const courseId = (courseData as any).id;

  for (const week of course.weeks) {
    await saveWeekWithTasks(courseId, week);
  }

  return courseId;
}

async function saveWeekWithTasks(courseId: string, week: CourseWeek): Promise<void> {
  const { data: weekData, error: weekError } = await db()
    .from("course_weeks")
    .insert({
      course_id: courseId,
      week_number: week.weekNumber,
      title: week.title,
      description: week.description,
      unlocked: week.unlocked,
      resources: week.resources ? JSON.parse(JSON.stringify(week.resources)) : null,
    } as any)
    .select("id")
    .single();

  if (weekError) throw weekError;

  if (week.tasks.length > 0) {
    const taskInserts = week.tasks.map((t, idx) => ({
      week_id: (weekData as any).id,
      task_id_client: t.id,
      label: t.label,
      description: t.description || null,
      type: t.type,
      completed: t.completed,
      sort_order: idx,
    }));

    const { error: tasksError } = await db()
      .from("course_tasks")
      .insert(taskInserts as any);

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
  const { error } = await db()
    .from("courses")
    .update({ current_week: currentWeek } as any)
    .eq("interest_id", interestId);

  if (error) throw error;
}

export async function unlockWeek(
  courseId: string,
  weekNumber: number
): Promise<void> {
  const { error } = await db()
    .from("course_weeks")
    .update({ unlocked: true } as any)
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
  const { error } = await db()
    .from("course_tasks")
    .update({ completed } as any)
    .eq("week_id", weekId)
    .eq("task_id_client", taskIdClient);

  if (error) throw error;
}

export async function getWeekId(
  courseId: string,
  weekNumber: number
): Promise<string | null> {
  const { data, error } = await db()
    .from("course_weeks")
    .select("id")
    .eq("course_id", courseId)
    .eq("week_number", weekNumber)
    .single();

  if (error) return null;
  return (data as any).id;
}

export async function getCourseId(interestId: string): Promise<string | null> {
  const { data, error } = await db()
    .from("courses")
    .select("id")
    .eq("interest_id", interestId)
    .limit(1)
    .single();

  if (error) return null;
  return (data as any).id;
}
