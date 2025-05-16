export interface User {
  id: string
  username: string
  email?: string
}

export interface SubstanceLog {
  id: string
  userId: string
  substanceType: string
  substanceSubtype?: string
  amount: string
  date: Date
  context: string
  supplements?: string[]
  notes?: string
}

export interface HarmIndex {
  score: number
  userId: string
  date: Date
  factors: {
    frequency: number
    quantity: number
    mixedSubstances: number
    harmReductionBehaviors: number
    substanceBreaks: number
    sleep: number
    exercise: number
    supplementation: number
  }
}

export interface Insight {
  id: string
  userId: string
  type: "pattern" | "correlation" | "recommendation"
  title: string
  description: string
  date: Date
}

export interface EducationalContent {
  id: string
  title: string
  description: string
  content: string
  category: string
  readTime: string
}

export interface SleepLog {
  id: string
  userId: string
  date: Date
  bedtime: string
  wakeTime: string
  duration: number // in minutes
  quality: "excellent" | "good" | "fair" | "poor" | "terrible"
  supplements?: string[]
  notes?: string
}

export interface ExerciseLog {
  id: string
  userId: string
  date: Date
  activityType: string
  duration: number // in minutes
  intensity: "light" | "moderate" | "vigorous" | "max"
  notes?: string
}

export interface SubstanceBreak {
  id: string
  userId: string
  substanceType: string
  startDate: Date
  endDate?: Date
  goalDuration: string // e.g., "1w", "2w", "1m", "3m", "indefinite"
  status: "active" | "completed" | "ended-early"
  notes?: string
}
