"use client";

import { Course, CourseWeek, CourseTask } from "@/types";
import { CheckCircle, Circle, Play, BookOpen, Wrench, Compass, ExternalLink, ChevronDown, ChevronRight, Lock } from "lucide-react";
import { useState } from "react";

interface CourseViewProps {
  course: Course;
  onToggleTask: (weekNumber: number, taskId: string) => void;
  onRequestMoreWeeks: () => void;
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

function WeekCard({ week, onToggleTask, isCurrentWeek }: { week: CourseWeek; onToggleTask: (taskId: string) => void; isCurrentWeek: boolean }) {
  const [expanded, setExpanded] = useState(isCurrentWeek);
  const completedTasks = week.tasks.filter((t) => t.completed).length;
  const totalTasks = week.tasks.length;
  const weekProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const isComplete = completedTasks === totalTasks && totalTasks > 0;

  return (
    <div className={`rounded-apple-lg border transition-all duration-300 ${
      isCurrentWeek
        ? "border-accent-200 bg-accent-50/30 shadow-sm"
        : week.unlocked
          ? "border-surface-200/60 bg-white"
          : "border-surface-200/40 bg-surface-50 opacity-60"
    }`}>
      <button
        onClick={() => week.unlocked && setExpanded(!expanded)}
        className={`w-full flex items-center gap-4 p-4 text-left ${week.unlocked ? "cursor-pointer" : "cursor-default"}`}
      >
        {/* Week number badge */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-body-sm font-bold shrink-0 ${
          isComplete
            ? "bg-emerald-100 text-emerald-600"
            : isCurrentWeek
              ? "bg-accent-100 text-accent-600"
              : week.unlocked
                ? "bg-surface-100 text-surface-600"
                : "bg-surface-100 text-surface-300"
        }`}>
          {isComplete ? (
            <CheckCircle className="w-5 h-5" />
          ) : !week.unlocked ? (
            <Lock className="w-4 h-4" />
          ) : (
            week.weekNumber
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-body-sm font-semibold text-surface-800 truncate">
              Week {week.weekNumber}: {week.title}
            </h4>
            {isCurrentWeek && (
              <span className="text-caption px-2 py-0.5 bg-accent-100 text-accent-600 rounded-full font-medium shrink-0">
                Current
              </span>
            )}
          </div>
          <p className="text-caption text-surface-400 truncate">{week.description}</p>
          {totalTasks > 0 && week.unlocked && (
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 bg-surface-200 rounded-full h-1.5 max-w-[120px]">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${isComplete ? "bg-emerald-500" : "bg-accent-500"}`}
                  style={{ width: `${weekProgress}%` }}
                />
              </div>
              <span className="text-caption text-surface-400">{completedTasks}/{totalTasks}</span>
            </div>
          )}
        </div>

        {week.unlocked && (
          expanded
            ? <ChevronDown className="w-4 h-4 text-surface-400 shrink-0" />
            : <ChevronRight className="w-4 h-4 text-surface-400 shrink-0" />
        )}
      </button>

      {expanded && week.unlocked && (
        <div className="px-4 pb-4 space-y-4 border-t border-surface-200/40 pt-3 animate-fade-in">
          {/* Tasks */}
          <div className="space-y-2">
            {week.tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-apple text-left transition-all duration-200 hover:bg-surface-100/80 ${
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
          {week.resources && week.resources.length > 0 && (
            <div>
              <p className="text-caption font-medium text-surface-400 uppercase tracking-wide mb-2">
                Resources
              </p>
              <div className="space-y-1.5">
                {week.resources.map((resource, i) => (
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

export default function CourseView({ course, onToggleTask, onRequestMoreWeeks, hideHeader }: CourseViewProps) {
  const totalTasks = course.weeks.reduce((sum, w) => sum + w.tasks.length, 0);
  const completedTasks = course.weeks.reduce((sum, w) => sum + w.tasks.filter((t) => t.completed).length, 0);
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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
          <span>Week {course.currentWeek} of {course.totalWeeks}</span>
        </div>
      </div>
      )}

      {/* Week cards */}
      <div className="space-y-3">
        {course.weeks.map((week) => (
          <WeekCard
            key={week.weekNumber}
            week={week}
            onToggleTask={(taskId) => onToggleTask(week.weekNumber, taskId)}
            isCurrentWeek={week.weekNumber === course.currentWeek}
          />
        ))}
      </div>

      {/* Load more weeks */}
      {course.weeks.length < course.totalWeeks && (
        <button
          onClick={onRequestMoreWeeks}
          className="w-full py-3 text-body-sm font-medium text-accent-600 hover:text-accent-700 bg-accent-50 hover:bg-accent-100 rounded-apple transition-colors"
        >
          Generate Next Weeks →
        </button>
      )}
    </div>
  );
}
