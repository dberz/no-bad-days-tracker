export type User = {
  id: string
  username: string
  email?: string
  created_at: string
  // New user profile fields for risk factors
  age?: number
  gender?: string
  health_conditions?: string[]
  psychiatric_conditions?: string[]
  risk_multiplier?: number
}

export type SubstanceLog = {
  id: string
  user_id: string
  substance_type: string
  substance_subtype?: string
  amount: string
  date: string
  context: string
  location?: string
  emotional_state?: string
  purpose?: string
  intention_outcome?: string
  harm_points: number // Calculated harm points for this log
  supplements?: string[]
  notes?: string
  feeling_during?: number
  feeling_after?: number
  notes_during?: string
  notes_after?: string
  created_at: string
}

export type InterventionLog = {
  id: string
  user_id: string
  date: string
  intervention_type: string // sleep, exercise, mindfulness, etc.
  subtype?: string // details about the intervention
  duration?: number // in minutes
  intensity?: string // light, moderate, vigorous
  quantity?: number // for interventions with quantity (e.g., oz of water)
  quality_rating?: number // user-reported quality
  context?: string
  location?: string
  intention_outcome?: string
  harm_reduction: number // Calculated harm reduction points
  notes?: string
  created_at: string
}

export type SleepLog = {
  id: string
  user_id: string
  date: string
  bedtime: string
  wake_time: string
  duration: number
  quality: "excellent" | "good" | "fair" | "poor" | "terrible"
  supplements?: string[]
  notes?: string
  harm_reduction?: number // New field for harm reduction points
  created_at: string
}

export type ExerciseLog = {
  id: string
  user_id: string
  date: string
  activity_type: string
  duration: number
  intensity: "light" | "moderate" | "vigorous" | "max"
  notes?: string
  harm_reduction?: number // New field for harm reduction points
  created_at: string
}

export type SubstanceBreak = {
  id: string
  user_id: string
  substance_type: string
  start_date: string
  end_date?: string
  goal_duration: string
  status: "active" | "completed" | "ended-early"
  notes?: string
  harm_reduction?: number // New field for harm reduction points
  created_at: string
}

export type HarmIndex = {
  id: string
  user_id: string
  date: string
  score: number // 0-100, higher means more harm
  substance_harm: number // Harm from substances
  intervention_reduction: number // Reduction from interventions
  decay_reduction: number // Reduction from natural decay
  factors?: Record<string, any>
  created_at: string
}

export type CustomSubstance = {
  id: string
  user_id: string
  name: string
  harm_points_per_unit: number // Base harm points per unit
  unit_name: string // e.g., "drink", "puff", "mg"
  half_life_days: number // For decay calculation
  created_at: string
}

export type CustomSupplement = {
  id: string
  user_id: string
  name: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      custom_substances: {
        Row: CustomSubstance
        Insert: CustomSubstance
        Update: CustomSubstance
      }
      custom_supplements: {
        Row: CustomSupplement
        Insert: CustomSupplement
        Update: CustomSupplement
      }
      exercise_logs: {
        Row: ExerciseLog
        Insert: ExerciseLog
        Update: ExerciseLog
      }
      harm_index: {
        Row: HarmIndex
        Insert: HarmIndex
        Update: HarmIndex
      }
      sleep_logs: {
        Row: SleepLog
        Insert: SleepLog
        Update: SleepLog
      }
      substance_breaks: {
        Row: SubstanceBreak
        Insert: SubstanceBreak
        Update: SubstanceBreak
      }
      substance_logs: {
        Row: SubstanceLog
        Insert: SubstanceLog
        Update: SubstanceLog
      }
      intervention_logs: {
        Row: InterventionLog
        Insert: InterventionLog
        Update: InterventionLog
      }
      user_profiles: {
        Row: User
        Insert: User
        Update: User
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      quality_enum: "excellent" | "good" | "fair" | "poor" | "terrible"
      intensity_enum: "light" | "moderate" | "vigorous" | "max"
      status_enum: "active" | "completed" | "ended-early"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
