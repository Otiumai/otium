"use client";

import { Course, CourseDay, CourseTask } from "@/types";
import { CheckCircle, Circle, Play, BookOpen, Wrench, Compass, ExternalLink, ChevronDown, ChevronRight, Lock } from "lucide-react";
import { useState } from "react";

interface CourseViewProps {
  course: Course;
  onToggleTask: (dayNumber: number, taskId: string) => void;
  onRequestMoreDays: () => void;
  hideHeader?: boolean;
}

function getTaskIcon(type: CourseTask["type"]) {
  const icons = {
    learn: <BookOpen className="w-4 h-4" />,
    practice: <Wrench className="w-4 h-4" />,
    create: <Play className="w-4 h-4" />,
    explore: <Compass className="w-4 h-4" />,
  };
  return icons[type] || <Circle className="w-4 h-4" />;
}

function getTaskColor(type: CourseTask["type"]) {
  const colors = {
    learn: "text-blue-500 bg-blue-50",
    practice: "text-amber-500 bg-amber-50",
    create: "text-emerald-500 bg-emerald-50",
    explore: "text-purple-500 bg-purple-50",
  };
  return colors[type] || "text-surface-400 bg-surface-100";
}

function getTaskLabel(type: CourseTask["type"]) {
  const labels = {
    learn: "Learn",
    practice: "Practice",
    create: "Create",
    explore: "Explore",
  };
  return labels[type] || type;
}

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

function DayCard({ day, onToggleTask, isCurrentDay }: { day: CourseDay; onToggleTask: (taskId: string) => void; isCurrentDay: boolean }) {
  const [expanded, setExpanded] = useState(isCurrentDay);
  const completedTasks = day.tasks.filter((t) => t.completed).length;
  const totalTasks = day.tasks.length;
  const dayProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const isComplete = completedTasks === totalTasks && totalTasks > 0;

  return (
    <div className={`rounded-apple-lg border transition-all duration-300 ${
      isCurrentDay
        ? "border-accent-200 bg-accent-50/30 shadow-sm"
        : day.unlocked
          ? "border-surface-200/60 bg-white"
          : "border-surface-200/40 bg-surface-50 opacity-60"
    }`}>
      <button
        onClick={() => day.unlocked && setExpanded(!expanded)}
        className={`w-full flex items-center gap-3 p-3 text-left ${day.unlocked ? "cursor-pointer" : "cursor-default"}`}
      >
        {/* Day number badge */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-caption font-bold shrink-0 ${
          isComplete
            ? "bg-emerald-100 text-emerald-600"
            : isCurrentDay
              ? "bg-accent-100 text-accent-600"
              : day.unlocked
                ? "bg-surface-100 text-surface-600"
                : "bg-surface-100 text-surface-300"
        }`}>
          {isComplete ? (
            <CheckCircle className="w-4 h-4" />
          ) : !day.unlocked ? (
            <Lock className="w-3.5 h-3.5" />
          ) : (
            day.dayNumber
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-body-sm font-semibold text-surface-800 truncate">
              {day.title}
            </h4>
            {isCurrentDay && (
              <span className="text-caption px-2 py-0.5 bg-accent-100 text-accent-600 rounded-full font-medium shrink-0">
                Today
              </span>
            )}
          </div>
          <p className="text-caption text-surface-400 truncate">{day.description}</p>
          {totalTasks > 0 && day.unlocked && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 bg-surface-200 rounded-full h-1 max-w-[100px]">
                <div
                  className={`h-1 rounded-full transition-all duration-500 ${isComplete ? "bg-emerald-500" : "bg-accent-500"}`}
                  style={{ width: `${dayProgress}%` }}
                />
              </div>
              <span className="text-caption text-surface-400">{completedTasks}/{totalTasks}</span>
            </div>
          )}
        </div>

        {day.unlocked && (
          expanded
            ? <ChevronDown className="w-4 h-4 text-surface-400 shrink-0" />
            : <ChevronRight className="w-4 h-4 text-surface-400 shrink-0" />
        )}
      </button>

      {expanded && day.unlocked && (
        <div className="px-3 pb-3 space-y-3 border-t border-surface-200/40 pt-2.5 animate-fade-in">
          {/* Tasks */}
          <div className="space-y-1.5">
            {day.tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={`w-full flex items-start gap-3 p-2.5 rounded-apple text-left transition-all duration-200 hover:bg-surface-100/80 ${
                  task.completed ? "opacity-60" : ""
                }`}
              >
                {task.completed ? (
                  <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-surface-300 mt-0.5 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-body-sm font-medium ${task.completed ? "line-through text-surface-400" : "text-surface-700"}`}>
                      {task.label}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-caption px-1.5 py-0.5 rounded-full ${getTaskColor(task.type)}`}>
                      {getTaskIcon(task.type)}
                      {getTaskLabel(task.type)}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-caption text-surface-400 mt-0.5">{task.description}</p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Resources */}
          {day.resources && day.resources.length > 0 && (
            <div>
              <p className="text-caption font-medium text-surface-400 uppercase tracking-wide mb-1.5">
                Resources
              </p>
              <div className="space-y-1">
                {day.resources.map((resource, i) => (
                  <a
                    key={i}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded-apple hover:bg-surface-100 transition-colors group"
                  >
                    <span className="text-caption">{
                      resource.type === "video" ? "▶️" :
                      resource.type === "article" ? "📄" :
                      resource.type === "course" ? "🎓" :
                      resource.type === "tool" ? "🔧" :
                      resource.type === "community" ? "👥" : "🔗"
                    }</span>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CourseView({ course, onToggleTask, onRequestMoreDays, hideHeader }: CourseViewProps) {
  const totalTasks = course.days.reduce((sum, d) => sum + d.tasks.length, 0);
  const completedTasks = course.days.reduce((sum, d) => sum + d.tasks.filter((t) => t.completed).length, 0);
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Group days into phases
  const groups: { key: number; label: string; days: CourseDay[] }[] = [];
  const groupMap = new Map<number, CourseDay[]>();

  for (const day of course.days) {
    const gk = getGroupKey(day.dayNumber);
    if (!groupMap.has(gk)) groupMap.set(gk, []);
    groupMap.get(gk)!.push(day);
  }

  for (const [key, days] of groupMap) {
    groups.push({ key, label: getGroupLabel(days[0].dayNumber), days });
  }

  return (
    <div className="space-y-4">
      {/* Overall progress header */}
      {!hideHeader && (
      <div className="bg-gradient-to-br from-surface-900 to-surface-800 rounded-apple-lg p-6 text-white">
        <h3 className="text-title font-display mb-1">{course.title}</h3>
        <p className="text-body-sm text-surface-300 mb-4">{course.description}</p>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="w-full bg-white/10 rounded-full h-2.5">
              <div
                className="bg-accent-400 h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
          <span className="text-body-sm font-semibold text-accent-300">{overallProgress}%</span>
        </div>
        <div className="flex items-center gap-4 mt-3 text-caption text-surface-400">
          <span>{completedTasks} of {totalTasks} tasks done</span>
          <span>•</span>
          <span>Day {course.currentDay} of {course.totalDays}</span>
        </div>
      </div>
      )}

      {/* Day cards grouped by phase */}
      {groups.map((group) => (
        <div key={group.key} className="space-y-2">
          <h4 className="text-caption font-semibold text-surface-400 uppercase tracking-wide px-1">
            {group.label}
          </h4>
          <div className="space-y-2">
            {group.days.map((day) => (
              <DayCard
                key={day.dayNumber}
                day={day}
                onToggleTask={(taskId) => onToggleTask(day.dayNumber, taskId)}
                isCurrentDay={day.dayNumber === course.currentDay}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Load more days */}
      {course.days.length < course.totalDays && (
        <button
          onClick={onRequestMoreDays}
          className="w-full py-3 text-body-sm font-medium text-accent-600 hover:text-accent-700 bg-accent-50 hover:bg-accent-100 rounded-apple transition-colors"
        >
          Generate Next Days →
        </button>
      )}
    </div>
  );
}
