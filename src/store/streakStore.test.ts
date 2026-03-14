import { beforeEach, describe, expect, it, vi } from 'vitest'
import { calculateStreakMetrics, useStreakStore } from './streakStore'

describe('streak store', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-14T10:00:00.000Z'))
    localStorage.clear()
    useStreakStore.setState({
      currentStreak: 0,
      longestStreak: 0,
      lastCelebratedStreak: 0,
      celebrationMessage: null,
    })
  })

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

  it('[streak] should ignore zero-minute records when calculating streaks', () => {
    const records = [
      { date: '2026-03-13', totalMinutes: 0 },
      { date: '2026-03-14', totalMinutes: 20 },
    ]

    expect(calculateStreakMetrics(records, '2026-03-14')).toEqual({
      currentStreak: 1,
      longestStreak: 1,
    })
  })

  it('[streak] should save milestone progress and create a celebration message', () => {
    useStreakStore.getState().syncFromRecords([
      { id: '1', date: '2026-03-10', totalMinutes: 20, sessions: [] },
      { id: '2', date: '2026-03-11', totalMinutes: 20, sessions: [] },
      { id: '3', date: '2026-03-12', totalMinutes: 20, sessions: [] },
      { id: '4', date: '2026-03-13', totalMinutes: 20, sessions: [] },
      { id: '5', date: '2026-03-14', totalMinutes: 20, sessions: [] },
    ])

    expect(useStreakStore.getState().currentStreak).toBe(5)
    expect(useStreakStore.getState().longestStreak).toBe(5)
    expect(useStreakStore.getState().lastCelebratedStreak).toBe(5)
    expect(useStreakStore.getState().celebrationMessage).toContain('5 days')
    expect(localStorage.getItem('focus_timer_streak')).toBe(
      JSON.stringify({ currentStreak: 5, longestStreak: 5, lastCelebratedStreak: 5 })
    )
  })

  it('[streak] should dismiss an existing celebration message', () => {
    useStreakStore.setState({ celebrationMessage: 'Keep going!' })

    useStreakStore.getState().dismissCelebration()

    expect(useStreakStore.getState().celebrationMessage).toBeNull()
  })
})
