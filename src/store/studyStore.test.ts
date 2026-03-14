import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useStudyStore } from './studyStore'
import { useAppStore } from './appStore'
import { useStreakStore } from './streakStore'
import { fetchRecords, upsertRecord } from '../utils/cloudStorage'

vi.mock('../utils/cloudStorage', () => ({
  fetchRecords: vi.fn(async () => []),
  upsertRecord: vi.fn(async () => undefined),
}))

describe('study store', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    useStudyStore.setState({
      records: [
        { id: '1', date: '2026-03-08', totalMinutes: 30, sessions: [] },
        { id: '2', date: '2026-03-14', totalMinutes: 90, sessions: [] },
      ],
      syncing: false,
    })
    useAppStore.setState({
      screen: 'home',
      showInterstitial: false,
      user: null,
    })
    useStreakStore.setState({
      currentStreak: 0,
      longestStreak: 0,
      lastCelebratedStreak: 0,
      celebrationMessage: null,
    })
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-14T10:00:00.000Z'))
  })

  it('[studyStore] should return today minutes when a record exists for today', () => {
    expect(useStudyStore.getState().getTodayMinutes()).toBe(90)
  })

  it('[studyStore] should return a week data entry for each of the last seven days', () => {
    expect(useStudyStore.getState().getWeekData()).toHaveLength(7)
  })

  it('[studyStore] should return a month data entry for each of the last thirty days', () => {
    const monthData = useStudyStore.getState().getMonthData()

    expect(monthData).toHaveLength(30)
    expect(monthData[monthData.length - 1]).toEqual({ date: '2026-03-14', minutes: 90 })
  })

  it('[studyStore] should sum all record minutes when total minutes are requested', () => {
    expect(useStudyStore.getState().getTotalMinutes()).toBe(120)
  })

  it('[studyStore] should add a session locally and persist the updated records', async () => {
    await useStudyStore.getState().addSession({
      id: 'session_1',
      startTime: 1,
      endTime: 2,
      duration: 25,
      date: '2026-03-14',
    })

    expect(useStudyStore.getState().getTodayMinutes()).toBe(115)
    expect(JSON.parse(localStorage.getItem('focus_timer_records') ?? '[]')).toEqual(
      useStudyStore.getState().records
    )
    expect(useStreakStore.getState().currentStreak).toBe(1)
  })

  it('[studyStore] should upsert the current record when a logged-in user adds a session', async () => {
    useAppStore.setState({
      user: {
        id: 'user-1',
        email: 'focus@example.com',
        displayName: 'Focus',
        avatarUrl: null,
      },
    })

    await useStudyStore.getState().addSession({
      id: 'session_2',
      startTime: 1,
      endTime: 2,
      duration: 25,
      date: '2026-03-14',
    })

    expect(upsertRecord).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({ date: '2026-03-14', totalMinutes: 115 })
    )
  })

  it('[studyStore] should upload local records when cloud storage is empty', async () => {
    vi.mocked(fetchRecords).mockResolvedValue([])
    localStorage.setItem(
      'focus_timer_records',
      JSON.stringify([
        { id: '1', date: '2026-03-08', totalMinutes: 30, sessions: [] },
        { id: '2', date: '2026-03-14', totalMinutes: 90, sessions: [] },
      ])
    )

    await useStudyStore.getState().syncFromCloud('user-1')

    expect(fetchRecords).toHaveBeenCalledWith('user-1')
    expect(upsertRecord).toHaveBeenCalledTimes(2)
    expect(useStudyStore.getState().syncing).toBe(false)
  })

  it('[studyStore] should replace local records with cloud data when records exist remotely', async () => {
    vi.mocked(fetchRecords).mockResolvedValue([
      { id: 'cloud-1', date: '2026-03-14', totalMinutes: 150, sessions: [] },
    ])

    await useStudyStore.getState().syncFromCloud('user-1')

    expect(useStudyStore.getState().records).toEqual([
      { id: 'cloud-1', date: '2026-03-14', totalMinutes: 150, sessions: [] },
    ])
    expect(JSON.parse(localStorage.getItem('focus_timer_records') ?? '[]')).toEqual([
      { id: 'cloud-1', date: '2026-03-14', totalMinutes: 150, sessions: [] },
    ])
    expect(useStudyStore.getState().syncing).toBe(false)
  })

  it('[studyStore] should recover cleanly when cloud sync fails', async () => {
    vi.mocked(fetchRecords).mockRejectedValue(new Error('network'))

    await useStudyStore.getState().syncFromCloud('user-1')

    expect(useStudyStore.getState().syncing).toBe(false)
  })
})
