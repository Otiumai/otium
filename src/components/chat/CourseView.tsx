"use client";

import { Course, CourseDay, CourseTask } from "@/types";
import { ExternalLink } from "lucide-react";
import { useState, useMemo } from "react";

interface CourseViewProps {
  course: Course;
  onToggleTask: (dayNumber: number, taskId: string) => void;
  onRequestMoreDays: () => void;
  hideHeader?: boolean;
}

/* ─── Badge color map ─── */

const badgeStyles: Record<CourseTask["type"], { bg: string; text: string; label: string }> = {
  learn:    { bg: "bg-blue-50",    text: "text-blue-600",    label: "Learn" },
  practice: { bg: "bg-amber-50",   text: "text-amber-600",   label: "Practice" },
  create:   { bg: "bg-emerald-50", text: "text-emerald-600", label: "Create" },
  explore:  { bg: "bg-purple-50",  text: "text-purple-600",  label: "Explore" },
};

function TypeBadge({ type }: { type: CourseTask["type"] }) {
  const s = badgeStyles[type] ?? { bg: "bg-surface-100", text: "text-surface-500", label: type };
  return (
    <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${s.bg} ${s.text} shrink-0`}>
      {s.label}
    </span>
  );
}

/* ─── Phase helpers ─── */

function getGroupLabel(dayNumber: number): string {
  if (dayNumber <= 7) return "Days 1–7: Getting Started";
  if (dayNumber <= 14) return "Days 8–14: Building Foundation";
  if (dayNumber <= 21) return "Days 15–21: Growing Skills";
  return "Days 22–30: Finding Your Style";
}

function getGroupKey(dayNumber: number): number {
  if (dayNumber <= 7) return 1;
  if (dayNumber <= 14) return 2;
  if (dayNumber <= 21) return 3;
  return 4;
}

/* ─── Day Row (collapsed / expanded) ─── */

function DayRow({
  day,
  onToggleTask,
  isCurrentDay,
}: {
  day: CourseDay;
  onToggleTask: (taskId: string) => void;
  isCurrentDay: boolean;
}) {
  const [expanded, setExpanded] = useState(isCurrentDay);
  const completedTasks = day.tasks.filter((t) => t.completed).length;
  const totalTasks = day.tasks.length;
  const isComplete = completedTasks === totalTasks && totalTasks > 0;
  const isLocked = !day.unlocked;

  const videoResources = day.resources?.filter((r) => r.type === "video") ?? [];
  const otherResources = day.resources?.filter((r) => r.type !== "video") ?? [];

  /* ── Collapsed row ── */
  const row = (
    <button
      onClick={() => !isLocked && setExpanded(!expanded)}
      className={`
        w-full flex items-center gap-3 px-4 py-3.5 rounded-apple text-left transition-all duration-200
        ${isLocked ? "opacity-35 cursor-default" : "cursor-pointer hover:bg-surface-50"}
        ${isCurrentDay && !expanded ? "border-2 border-accent-500 bg-white" : "bg-surface-100/80"}
      `}
    >
      {/* Status circle */}
      {isComplete ? (
        <div className="w-[22px] h-[22px] rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
          <span className="text-white text-[12px] font-bold leading-none">✓</span>
        </div>
      ) : isLocked ? (
        <div className="w-[22px] h-[22px] rounded-full border-2 border-surface-200 flex items-center justify-center shrink-0">
          <span className="text-surface-400 text-[11px]">🔒</span>
        </div>
      ) : isCurrentDay ? (
        <div className="w-[10px] h-[10px] rounded-full bg-accent-500 shrink-0" />
      ) : (
        <div className="w-[22px] h-[22px] rounded-full border-2 border-surface-200 shrink-0" />
      )}

      {/* Title + description */}
      <div className="flex-1 min-w-0">
        <div className="text-body-sm font-semibold text-surface-800 truncate">
          {day.title}
        </div>
        {(isComplete || isCurrentDay) && day.description && (
          <div className="text-caption text-surface-400 truncate mt-0.5">
            {day.description}
          </div>
        )}
        {isCurrentDay && totalTasks > 0 && (
          <div className="text-caption text-surface-400 mt-0.5">
            {completedTasks}/{totalTasks} tasks done
          </div>
        )}
      </div>

      {/* Right side info */}
      {isCurrentDay ? (
        <span className="text-[11px] font-semibold text-accent-500 shrink-0">Today</span>
      ) : isComplete ? (
        <span className="text-caption text-surface-400 shrink-0">{completedTasks}/{totalTasks} tasks</span>
      ) : isLocked ? (
        <span className="text-caption text-surface-400 shrink-0">🔒</span>
      ) : totalTasks > 0 ? (
        <span className="text-caption text-surface-400 shrink-0">{totalTasks} tasks</span>
      ) : null}
    </button>
  );

  /* ── Expanded view ── */
  if (expanded && !isLocked) {
    return (
      <div className="border-2 border-accent-500 rounded-apple bg-white overflow-hidden transition-all duration-300">
        {/* Header row */}
        <button
          onClick={() => setExpanded(false)}
          className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer"
        >
          <div className="w-[10px] h-[10px] rounded-full bg-accent-500 shrink-0" />
          <div className="text-[16px] font-bold text-surface-800">{day.title}</div>
          {isCurrentDay && (
            <span className="ml-auto text-[11px] font-semibold text-accent-500 bg-accent-50 px-2.5 py-0.5 rounded-full shrink-0">
              Today
            </span>
          )}
        </button>

        {/* Tasks */}
        <div className="px-5 pb-4">
          {day.tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className="w-full flex items-center gap-3 py-2.5 border-b border-surface-100 last:border-b-0 text-left transition-colors hover:bg-surface-50/50"
            >
              {/* Checkbox */}
              {task.completed ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <span className="text-white text-[11px] font-bold leading-none">✓</span>
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-surface-200 shrink-0" />
              )}

              {/* Label */}
              <span
                className={`text-body-sm font-medium flex-1 ${
                  task.completed ? "line-through text-surface-400" : "text-surface-800"
                }`}
              >
                {task.label}
              </span>

              {/* Type badge */}
              <TypeBadge type={task.type} />
            </button>
          ))}

          {/* Video resources */}
          {videoResources.length > 0 && (
            <div className="mt-4 space-y-2">
              {videoResources.map((resource, i) => (
                <a
                  key={`video-${i}`}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 px-4 py-3.5 rounded-apple bg-gradient-to-r from-red-950 to-red-900 text-white group transition-opacity hover:opacity-90"
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <span className="text-lg">▶️</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold truncate">{resource.title}</div>
                    {resource.platform && (
                      <div className="text-[11px] text-white/60 mt-0.5">{resource.platform}</div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded shrink-0">
                    YouTube
                  </span>
                </a>
              ))}
            </div>
          )}

          {/* Other resources */}
          {otherResources.length > 0 && (
            <div className="mt-3 space-y-1">
              {otherResources.map((resource, i) => (
                <a
                  key={`resource-${i}`}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-2.5 rounded-apple hover:bg-surface-100 transition-colors group"
                >
                  <span className="text-caption">
                    {resource.type === "article" ? "📄" :
                     resource.type === "course" ? "🎓" :
                     resource.type === "tool" ? "🔧" :
                     resource.type === "community" ? "👥" : "🔗"}
                  </span>
                  <span className="text-body-sm text-surface-600 group-hover:text-accent-600 transition-colors flex-1 truncate">
                    {resource.title}
                  </span>
                  {resource.platform && (
                    <span className="text-caption text-surface-300">{resource.platform}</span>
                  )}
                  <ExternalLink className="w-3 h-3 text-surface-300 group-hover:text-accent-500 shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return row;
}

/* ─── Main CourseView ─── */

export default function CourseView({ course, onToggleTask, onRequestMoreDays, hideHeader }: CourseViewProps) {
  const totalTasks = course.days.reduce((sum, d) => sum + d.tasks.length, 0);
  const completedTasks = course.days.reduce((sum, d) => sum + d.tasks.filter((t) => t.completed).length, 0);
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const completedDays = course.days.filter(
    (d) => d.tasks.length > 0 && d.tasks.every((t) => t.completed)
  ).length;

  /* Find the "Up Next" task: first incomplete task on the current day (or first unlocked incomplete) */
  const upNextInfo = useMemo(() => {
    const currentDayData = course.days.find((d) => d.dayNumber === course.currentDay);
    if (currentDayData) {
      const nextTask = currentDayData.tasks.find((t) => !t.completed);
      if (nextTask) return { task: nextTask, dayNumber: currentDayData.dayNumber };
    }
    for (const d of course.days) {
      if (!d.unlocked) continue;
      const nextTask = d.tasks.find((t) => !t.completed);
      if (nextTask) return { task: nextTask, dayNumber: d.dayNumber };
    }
    return null;
  }, [course]);

  /* Group days into phases */
  const groups = useMemo(() => {
    const result: { key: number; label: string; days: CourseDay[] }[] = [];
    const groupMap = new Map<number, CourseDay[]>();
    for (const day of course.days) {
      const gk = getGroupKey(day.dayNumber);
      if (!groupMap.has(gk)) groupMap.set(gk, []);
      groupMap.get(gk)!.push(day);
    }
    for (const [key, days] of groupMap) {
      result.push({ key, label: getGroupLabel(days[0].dayNumber), days });
    }
    return result;
  }, [course.days]);

  return (
    <div className="space-y-5">
      {/* ── Header ── */}
      {!hideHeader && (
        <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] rounded-apple-lg p-7 text-white relative overflow-hidden">
          {/* Decorative emoji */}
          <span className="absolute top-5 right-7 text-[48px] opacity-20 pointer-events-none select-none">📸</span>

          <h3 className="text-title font-display tracking-tight mb-4">{course.title}</h3>

          {/* Full-width progress bar */}
          <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-accent-500 rounded-full transition-all duration-700"
              style={{ width: `${overallProgress}%` }}
            />
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-5 text-[13px] text-white/60">
            <span>
              <span className="text-white font-semibold">{completedTasks}</span>/{totalTasks} tasks
            </span>
            <span>·</span>
            <span>
              <span className="text-white font-semibold">{completedDays}</span> days done
            </span>
            <span>·</span>
            <span>
              Day <span className="text-white font-semibold">{course.currentDay}</span>
            </span>
          </div>
        </div>
      )}

      {/* ── Up Next card ── */}
      {upNextInfo && (
        <button
          onClick={() => onToggleTask(upNextInfo.dayNumber, upNextInfo.task.id)}
          className="w-full bg-gradient-to-r from-accent-500 to-accent-600 rounded-apple text-white p-4 flex items-start gap-3.5 text-left transition-opacity hover:opacity-95"
        >
          <div className="w-[22px] h-[22px] rounded-full border-2 border-white/50 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-white/70 font-semibold">Up Next</div>
            <div className="text-[15px] font-semibold mt-0.5 leading-snug">{upNextInfo.task.label}</div>
            <span className="inline-block text-[11px] font-semibold bg-white/20 px-2.5 py-0.5 rounded-full mt-1.5">
              {badgeStyles[upNextInfo.task.type]?.label ?? upNextInfo.task.type}
            </span>
          </div>
        </button>
      )}

      {/* ── Day rows grouped by phase ── */}
      {groups.map((group) => (
        <div key={group.key} className="space-y-2">
          <h4 className="text-[13px] font-semibold text-surface-400 uppercase tracking-wide px-1 mt-2">
            {group.label}
          </h4>
          <div className="space-y-2">
            {group.days.map((day) => (
              <DayRow
                key={day.dayNumber}
                day={day}
                onToggleTask={(taskId) => onToggleTask(day.dayNumber, taskId)}
                isCurrentDay={day.dayNumber === course.currentDay}
              />
            ))}
          </div>
        </div>
      ))}

      {/* ── Load more days ── */}
      {course.days.length < course.totalDays && (
        <button
          onClick={onRequestMoreDays}
          className="w-full py-3.5 text-body-sm font-semibold text-accent-600 hover:text-accent-700 bg-accent-50 hover:bg-accent-100 rounded-apple transition-colors"
        >
          Generate Next Days →
        </button>
      )}
    </div>
  );
}
