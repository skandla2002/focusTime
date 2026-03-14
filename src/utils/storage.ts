import type { StudyRecord, FocusSession, StudyGoal } from '../types'

const RECORDS_KEY = 'focus_timer_records'
const GOAL_KEY = 'focus_timer_goal'

export function getRecords(): StudyRecord[] {
  try {
    const data = localStorage.getItem(RECORDS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveRecords(records: StudyRecord[]): void {
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records))
}

export function getGoal(): StudyGoal {
  try {
    const data = localStorage.getItem(GOAL_KEY)
    return data ? JSON.parse(data) : { dailyGoalMinutes: 120 }
  } catch {
    return { dailyGoalMinutes: 120 }
  }
}

export function saveGoal(goal: StudyGoal): void {
  localStorage.setItem(GOAL_KEY, JSON.stringify(goal))
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

export function addSessionToRecords(
  records: StudyRecord[],
  session: FocusSession
): StudyRecord[] {
  const today = getTodayString()
  const existing = records.find((r) => r.date === today)

  if (existing) {
    const updated = {
      ...existing,
      totalMinutes: existing.totalMinutes + session.duration,
      sessions: [...existing.sessions, session],
    }
    return records.map((r) => (r.date === today ? updated : r))
  }

  const newRecord: StudyRecord = {
    id: `record_${today}`,
    date: today,
    totalMinutes: session.duration,
    sessions: [session],
  }
  return [...records, newRecord]
}

export function getLast7Days(): string[] {
  const days: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}

export function getLast30Days(): string[] {
  const days: string[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().split('T')[0])
  }
  return days
}
