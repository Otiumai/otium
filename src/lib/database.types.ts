// Auto-generated types for Supabase database schema
// These types mirror the tables defined in supabase-schema.sql

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          email: string | null;
          plan: "free" | "pro";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          email?: string | null;
          plan?: "free" | "pro";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string | null;
          plan?: "free" | "pro";
          created_at?: string;
          updated_at?: string;
        };
      };
      interests: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          emoji: string;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          emoji: string;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          emoji?: string;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          interest_id: string;
          role: "user" | "assistant";
          content: string;
          quick_replies: Json | null;
          creators: Json | null;
          course_update: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          interest_id: string;
          role: "user" | "assistant";
          content: string;
          quick_replies?: Json | null;
          creators?: Json | null;
          course_update?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          interest_id?: string;
          role?: "user" | "assistant";
          content?: string;
          quick_replies?: Json | null;
          creators?: Json | null;
          course_update?: Json | null;
          created_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          interest_id: string;
          title: string;
          description: string;
          total_weeks: number;
          current_week: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          interest_id: string;
          title: string;
          description: string;
          total_weeks: number;
          current_week?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          interest_id?: string;
          title?: string;
          description?: string;
          total_weeks?: number;
          current_week?: number;
          created_at?: string;
        };
      };
      course_weeks: {
        Row: {
          id: string;
          course_id: string;
          week_number: number;
          title: string;
          description: string;
          unlocked: boolean;
          resources: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          week_number: number;
          title: string;
          description: string;
          unlocked?: boolean;
          resources?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          week_number?: number;
          title?: string;
          description?: string;
          unlocked?: boolean;
          resources?: Json | null;
          created_at?: string;
        };
      };
      course_tasks: {
        Row: {
          id: string;
          week_id: string;
          task_id_client: string;
          label: string;
          description: string | null;
          type: "learn" | "practice" | "create" | "explore";
          completed: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          week_id: string;
          task_id_client: string;
          label: string;
          description?: string | null;
          type: "learn" | "practice" | "create" | "explore";
          completed?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          week_id?: string;
          task_id_client?: string;
          label?: string;
          description?: string | null;
          type?: "learn" | "practice" | "create" | "explore";
          completed?: boolean;
          sort_order?: number;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      plan_type: "free" | "pro";
      message_role: "user" | "assistant";
      task_type: "learn" | "practice" | "create" | "explore";
    };
  };
}
