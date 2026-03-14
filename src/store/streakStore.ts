import { create } from 'zustand'
import type { StudyRecord, StreakSnapshot } from '../types'
import { getRecords, getStreakData, getTodayString, saveStreakData } from '../utils/storage'

export interface StreakMetrics {
  currentStreak: number
  longestStreak: number
}

interface StreakState extends StreakSnapshot {
  celebrationMessage: string | null
  syncFromRecords: (records: StudyRecord[]) => void
  dismissCelebration: () => void
}

const MILESTONES = [5, 10, 30]

function toUtcDay(date: string): number {
  const [year, month, day] = date.split('-').map(Number)
  return Math.floor(Date.UTC(year, month - 1, day) / 86400000)
}

function dayNumberToString(dayNumber: number): string {
  return new Date(dayNumber * 86400000).toISOString().slice(0, 10)
}

function getHighestMilestone(streak: number): number {
  return MILESTONES.reduce((highest, milestone) => (streak >= milestone ? milestone : highest), 0)
}

function getCelebrationMessage(streak: number): string {
  return `Streak unlocked: ${streak} days in a row. Keep the momentum going.`
}

export function calculateStreakMetrics(
  records: Pick<StudyRecord, 'date' | 'totalMinutes'>[],
  today: string = getTodayString()
): StreakMetrics {
  const activeDates = Array.from(
    new Set(records.filter((record) => record.totalMinutes > 0).map((record) => record.date))
  ).sort()

  if (activeDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 }
  }

  let longestStreak = 1
  let runningStreak = 1

  for (let index = 1; index < activeDates.length; index += 1) {
    const previous = toUtcDay(activeDates[index - 1])
    const current = toUtcDay(activeDates[index])

    if (current - previous === 1) {
      runningStreak += 1
      longestStreak = Math.max(longestStreak, runningStreak)
    } else {
      runningStreak = 1
    }
  }

  const dateSet = new Set(activeDates)
  if (!dateSet.has(today)) {
    return { currentStreak: 0, longestStreak }
  }

  let currentStreak = 1
  let cursor = toUtcDay(today) - 1

  while (dateSet.has(dayNumberToString(cursor))) {
    currentStreak += 1
    cursor -= 1
  }

  return { currentStreak, longestStreak: Math.max(longestStreak, currentStreak) }
}

function buildInitialState(): StreakSnapshot {
  const stored = getStreakData()
  const metrics = calculateStreakMetrics(getRecords())

  return {
    currentStreak: metrics.currentStreak,
    longestStreak: Math.max(stored.longestStreak, metrics.longestStreak),
    lastCelebratedStreak: stored.lastCelebratedStreak,
  }
}

export const useStreakStore = create<StreakState>((set, get) => {
  const initial = buildInitialState()

  return {
    ...initial,
    celebrationMessage: null,

    syncFromRecords: (records) => {
      const metrics = calculateStreakMetrics(records)
      const previous = get()
      const longestStreak = Math.max(previous.longestStreak, metrics.longestStreak)
      const highestMilestone = getHighestMilestone(metrics.currentStreak)
      const shouldCelebrate = highestMilestone > previous.lastCelebratedStreak
      const snapshot: StreakSnapshot = {
        currentStreak: metrics.currentStreak,
        longestStreak,
        lastCelebratedStreak: shouldCelebrate ? highestMilestone : previous.lastCelebratedStreak,
      }

      saveStreakData(snapshot)
      set({
        ...snapshot,
        celebrationMessage: shouldCelebrate ? getCelebrationMessage(highestMilestone) : previous.celebrationMessage,
      })
    },

    dismissCelebration: () => {
      set({ celebrationMessage: null })
    },
  }
})
