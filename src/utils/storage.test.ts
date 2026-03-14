import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  addSessionToRecords,
  getGoal,
  getLast30Days,
  getLast7Days,
  getRecords,
  getStreakData,
  getTodayString,
  saveGoal,
  saveRecords,
  saveStreakData,
} from './storage'
import type { FocusSession } from '../types'

describe('storage utils', () => {
  beforeEach(() => {
    vi.useRealTimers()
    localStorage.clear()
  })

  it('[storage] should persist and read records when records are saved', () => {
    const records = [{ id: 'r1', date: '2026-03-14', totalMinutes: 25, sessions: [] }]
    saveRecords(records)
    expect(getRecords()).toEqual(records)
  })

  it('[storage] should add a session to today when there is an existing record', () => {
    vi.setSystemTime(new Date('2026-03-14T10:00:00.000Z'))
    const session: FocusSession = {
      id: 's1',
      startTime: 1,
      endTime: 2,
      duration: 25,
      date: '2026-03-14',
    }
    const records = [{ id: 'r1', date: '2026-03-14', totalMinutes: 30, sessions: [] }]

    expect(addSessionToRecords(records, session)).toEqual([
      {
        id: 'r1',
        date: '2026-03-14',
        totalMinutes: 55,
        sessions: [session],
      },
    ])
  })

  it('[storage] should create a new record when today has no existing entry', () => {
    vi.setSystemTime(new Date('2026-03-14T10:00:00.000Z'))
    const session: FocusSession = {
      id: 's2',
      startTime: 10,
      endTime: 20,
      duration: 15,
      date: '2026-03-14',
    }

    expect(addSessionToRecords([], session)).toEqual([
      {
        id: 'record_2026-03-14',
        date: '2026-03-14',
        totalMinutes: 15,
        sessions: [session],
      },
    ])
  })

  it('[storage] should return the default goal when none is stored', () => {
    expect(getGoal()).toEqual({ dailyGoalMinutes: 120 })
  })

  it('[storage] should return an empty list when saved records are malformed', () => {
    localStorage.setItem('focus_timer_records', '{bad json')

    expect(getRecords()).toEqual([])
  })

  it('[storage] should persist streak metadata when it is saved', () => {
    const snapshot = { currentStreak: 2, longestStreak: 5, lastCelebratedStreak: 5 }
    saveStreakData(snapshot)
    expect(getStreakData()).toEqual(snapshot)
  })

  it('[storage] should return the default goal when stored goal data is malformed', () => {
    localStorage.setItem('focus_timer_goal', '{bad json')

    expect(getGoal()).toEqual({ dailyGoalMinutes: 120 })
  })

  it('[storage] should save and reload the goal when a goal is written', () => {
    saveGoal({ dailyGoalMinutes: 180 })
    expect(getGoal()).toEqual({ dailyGoalMinutes: 180 })
  })

  it('[storage] should produce today as an iso date string', () => {
    expect(getTodayString()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('[storage] should generate the last seven days in ascending order', () => {
    vi.setSystemTime(new Date('2026-03-14T10:00:00.000Z'))

    expect(getLast7Days()).toEqual([
      '2026-03-08',
      '2026-03-09',
      '2026-03-10',
      '2026-03-11',
      '2026-03-12',
      '2026-03-13',
      '2026-03-14',
    ])
  })

  it('[storage] should generate a 30-day window ending today', () => {
    vi.setSystemTime(new Date('2026-03-14T10:00:00.000Z'))
    const days = getLast30Days()

    expect(days).toHaveLength(30)
    expect(days[0]).toBe('2026-02-13')
    expect(days[days.length - 1]).toBe('2026-03-14')
  })
})
