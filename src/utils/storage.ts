import * as Sentry from '@sentry/react'
import type { FocusSession, StudyGoal, StudyRecord, StreakSnapshot } from '../types'

const RECORDS_KEY = 'focus_timer_records'
const GOAL_KEY = 'focus_timer_goal'
const STREAK_KEY = 'focus_timer_streak'

function reportStorageError(error: unknown, context: string): void {
  if (!import.meta.env.VITE_SENTRY_DSN) {
    return
  }

  Sentry.captureException(error, {
    tags: { module: 'storage' },
    extra: { context },
  })
}

export function getRecords(): StudyRecord[] {
  try {
    const data = localStorage.getItem(RECORDS_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    reportStorageError(error, 'getRecords')
    return []
  }
}

export function saveRecords(records: StudyRecord[]): void {
  try {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records))
  } catch (error) {
    reportStorageError(error, 'saveRecords')
  }
}

export function getGoal(): StudyGoal {
  try {
    const data = localStorage.getItem(GOAL_KEY)
    return data ? JSON.parse(data) : { dailyGoalMinutes: 120 }
  } catch (error) {
    reportStorageError(error, 'getGoal')
    return { dailyGoalMinutes: 120 }
  }
}

export function saveGoal(goal: StudyGoal): void {
  try {
    localStorage.setItem(GOAL_KEY, JSON.stringify(goal))
  } catch (error) {
    reportStorageError(error, 'saveGoal')
  }
}

export function getStreakData(): StreakSnapshot {
  try {
    const data = localStorage.getItem(STREAK_KEY)
    return data
      ? JSON.parse(data)
      : { currentStreak: 0, longestStreak: 0, lastCelebratedStreak: 0 }
  } catch (error) {
    reportStorageError(error, 'getStreakData')
    return { currentStreak: 0, longestStreak: 0, lastCelebratedStreak: 0 }
  }
}

export function saveStreakData(snapshot: StreakSnapshot): void {
  try {
    localStorage.setItem(STREAK_KEY, JSON.stringify(snapshot))
  } catch (error) {
    reportStorageError(error, 'saveStreakData')
  }
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

export function addSessionToRecords(
  records: StudyRecord[],
  session: FocusSession
): StudyRecord[] {
  const today = getTodayString()
  const existing = records.find((record) => record.date === today)

  if (existing) {
    const updated = {
      ...existing,
      totalMinutes: existing.totalMinutes + session.duration,
      sessions: [...existing.sessions, session],
    }
    return records.map((record) => (record.date === today ? updated : record))
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
  for (let index = 6; index >= 0; index -= 1) {
    const date = new Date()
    date.setDate(date.getDate() - index)
    days.push(date.toISOString().split('T')[0])
  }
  return days
}

export function getLast30Days(): string[] {
  const days: string[] = []
  for (let index = 29; index >= 0; index -= 1) {
    const date = new Date()
    date.setDate(date.getDate() - index)
    days.push(date.toISOString().split('T')[0])
  }
  return days
}
