export interface Database {
  public: {
    Tables: {
      pain_types: {
        Row: {
          id: string;
          name: string;
          description: string;
          body_area: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          body_area: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          body_area?: string;
          created_at?: string;
        };
      };
      exercises: {
        Row: {
          id: string;
          name: string;
          description: string;
          instructions: string[];
          duration_seconds: number;
          repetitions: number;
          difficulty_level: 'beginner' | 'intermediate' | 'advanced';
          animation_type: string;
          benefits: string[];
          precautions: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          instructions: string[];
          duration_seconds?: number;
          repetitions?: number;
          difficulty_level: 'beginner' | 'intermediate' | 'advanced';
          animation_type: string;
          benefits: string[];
          precautions: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          instructions?: string[];
          duration_seconds?: number;
          repetitions?: number;
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
          animation_type?: string;
          benefits?: string[];
          precautions?: string[];
          created_at?: string;
        };
      };
      pain_exercise_mapping: {
        Row: {
          id: string;
          pain_type_id: string;
          exercise_id: string;
          effectiveness_rating: number;
          priority_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          pain_type_id: string;
          exercise_id: string;
          effectiveness_rating: number;
          priority_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          pain_type_id?: string;
          exercise_id?: string;
          effectiveness_rating?: number;
          priority_order?: number;
          created_at?: string;
        };
      };
      user_sessions: {
        Row: {
          id: string;
          pain_type_id: string;
          exercises_completed: unknown;
          session_duration_minutes: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          pain_type_id: string;
          exercises_completed?: unknown;
          session_duration_minutes?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          pain_type_id?: string;
          exercises_completed?: unknown;
          session_duration_minutes?: number;
          created_at?: string;
        };
      };
    };
  };
}

export type PainType = Database['public']['Tables']['pain_types']['Row'];
export type Exercise = Database['public']['Tables']['exercises']['Row'];
export type PainExerciseMapping = Database['public']['Tables']['pain_exercise_mapping']['Row'];
