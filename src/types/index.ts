export interface FocusSession {
  id: string
  startTime: number
  endTime: number
  duration: number // minutes
  date: string // YYYY-MM-DD
  memo?: string
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
export type Screen = 'home' | 'timer' | 'statistics' | 'goal' | 'memo'

/** E2E 테스트 모드: URL에 ?e2e=1 포함 시 타이머를 5초로 단축 */
const IS_E2E = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('e2e') === '1'

export const FOCUS_DURATION = IS_E2E ? 5 : 25 * 60 // 25 minutes in seconds (E2E: 5s)
export const BREAK_DURATION = IS_E2E ? 3 : 5 * 60  // 5 minutes in seconds  (E2E: 3s)

export interface AppUser {
  id: string
  email: string | null
  displayName: string | null
  avatarUrl: string | null
}

export interface StreakSnapshot {
  currentStreak: number
  longestStreak: number
  lastCelebratedStreak: number
}
