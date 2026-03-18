export interface Interest {
  id: string;
  name: string;
  emoji: string;
  messages: ChatMessage[];
  progress: ProgressItem[];
  course: Course | null;
  onboarding: OnboardingState;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  quickReplies?: QuickReply[];
  creators?: Creator[];
  courseUpdate?: CourseDay[];
}

export interface QuickReply {
  id: string;
  label: string;
  emoji?: string;
}

export interface Creator {
  name: string;
  platform: "youtube" | "instagram" | "tiktok" | "podcast" | "website" | "twitter" | "twitch" | "other";
  url: string;
  description: string;
}

export interface OnboardingState {
  completed: boolean;
  answers: OnboardingAnswer[];
}

export interface OnboardingAnswer {
  question: string;
  answer: string;
}

export interface Course {
  title: string;
  description: string;
  totalDays: number;
  currentDay: number;
  days: CourseDay[];
  generatedAt: Date;
}

export interface CourseDay {
  dayNumber: number;
  title: string;
  description: string;
  tasks: CourseTask[];
  resources: CourseResource[];
  unlocked: boolean;
}

export interface CourseTask {
  id: string;
  label: string;
  description?: string;
  completed: boolean;
  type: "learn" | "practice" | "create" | "explore";
}

export interface CourseResource {
  title: string;
  url: string;
  type: "video" | "article" | "course" | "tool" | "community";
  platform?: string;
}

export interface ProgressItem {
  id: string;
  label: string;
  completed: boolean;
  category: "beginner" | "intermediate" | "advanced";
}

export interface RecommendationSection {
  title: string;
  emoji: string;
  items: string[];
}
