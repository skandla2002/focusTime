import { describe, expect, it } from 'vitest'
import { calculateStreakMetrics } from './streakStore'

describe('streak store', () => {
  it('[streak] should return zero values when there are no active records', () => {
    expect(calculateStreakMetrics([], '2026-03-14')).toEqual({
      currentStreak: 0,
      longestStreak: 0,
    })
  })

  it('[streak] should count consecutive days when today is included', () => {
    const records = [
      { date: '2026-03-12', totalMinutes: 30 },
      { date: '2026-03-13', totalMinutes: 45 },
      { date: '2026-03-14', totalMinutes: 25 },
    ]

    expect(calculateStreakMetrics(records, '2026-03-14')).toEqual({
      currentStreak: 3,
      longestStreak: 3,
    })
  })

  it('[streak] should reset the current streak when today has no study record', () => {
    const records = [
      { date: '2026-03-11', totalMinutes: 60 },
      { date: '2026-03-12', totalMinutes: 60 },
      { date: '2026-03-13', totalMinutes: 60 },
    ]

    expect(calculateStreakMetrics(records, '2026-03-14')).toEqual({
      currentStreak: 0,
      longestStreak: 3,
    })
  })

  it('[streak] should keep the longest streak when there is a gap in the record history', () => {
    const records = [
      { date: '2026-03-01', totalMinutes: 25 },
      { date: '2026-03-02', totalMinutes: 30 },
      { date: '2026-03-05', totalMinutes: 45 },
      { date: '2026-03-06', totalMinutes: 35 },
      { date: '2026-03-07', totalMinutes: 20 },
      { date: '2026-03-14', totalMinutes: 50 },
    ]

    expect(calculateStreakMetrics(records, '2026-03-14')).toEqual({
      currentStreak: 1,
      longestStreak: 3,
    })
  })
})
