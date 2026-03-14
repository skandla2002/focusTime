export interface FocusSession {
  id: string
  startTime: number
  endTime: number
  duration: number // minutes
  date: string // YYYY-MM-DD
}

export interface StudyRecord {
  id: string
  date: string // YYYY-MM-DD
  totalMinutes: number
  sessions: FocusSession[]
}

export interface StudyGoal {
  dailyGoalMinutes: number
}

export type TimerMode = 'focus' | 'break'
export type TimerStatus = 'idle' | 'running' | 'paused'
export type Screen = 'home' | 'timer' | 'statistics' | 'goal'

export const FOCUS_DURATION = 25 * 60 // 25 minutes in seconds
export const BREAK_DURATION = 5 * 60 // 5 minutes in seconds
