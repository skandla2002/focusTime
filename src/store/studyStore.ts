import { create } from 'zustand'
import type { StudyRecord, FocusSession } from '../types'
import {
  getRecords,
  saveRecords,
  addSessionToRecords,
  getTodayString,
  getLast7Days,
  getLast30Days,
} from '../utils/storage'
import { fetchRecords, upsertRecord } from '../utils/cloudStorage'
import { useStreakStore } from './streakStore'

interface StudyState {
  records: StudyRecord[]
  syncing: boolean
  addSession: (session: FocusSession) => Promise<void>
  getTodayMinutes: () => number
  getWeekData: () => { date: string; minutes: number }[]
  getMonthData: () => { date: string; minutes: number }[]
  getTotalMinutes: () => number
  syncFromCloud: (userId: string) => Promise<void>
}

export const useStudyStore = create<StudyState>((set, get) => ({
  records: getRecords(),
  syncing: false,

  addSession: async (session: FocusSession) => {
    const { records } = get()
    const updated = addSessionToRecords(records, session)
    saveRecords(updated)
    useStreakStore.getState().syncFromRecords(updated)
    set({ records: updated })

    // 로그인 상태이면 당일 기록 cloud upsert
    const { useAppStore } = await import('./appStore')
    const userId = useAppStore.getState().user?.id
    if (userId) {
      const today = getTodayString()
      const todayRecord = updated.find((r) => r.date === today)
      if (todayRecord) {
        upsertRecord(userId, todayRecord).catch(console.error)
      }
    }
  },

  getTodayMinutes: () => {
    const { records } = get()
    const today = getTodayString()
    const record = records.find((r) => r.date === today)
    return record?.totalMinutes ?? 0
  },

  getWeekData: () => {
    const { records } = get()
    return getLast7Days().map((date) => {
      const record = records.find((r) => r.date === date)
      return { date, minutes: record?.totalMinutes ?? 0 }
    })
  },

  getMonthData: () => {
    const { records } = get()
    return getLast30Days().map((date) => {
      const record = records.find((r) => r.date === date)
      return { date, minutes: record?.totalMinutes ?? 0 }
    })
  },

  getTotalMinutes: () => {
    const { records } = get()
    return records.reduce((sum, r) => sum + r.totalMinutes, 0)
  },

  /** 로그인 직후 cloud 기록을 로컬에 병합 */
  syncFromCloud: async (userId: string) => {
    set({ syncing: true })
    try {
      const cloudRecords = await fetchRecords(userId)
      if (cloudRecords.length === 0) {
        // 신규 사용자: 로컬 기록을 cloud에 업로드
        const localRecords = getRecords()
        await Promise.all(localRecords.map((r) => upsertRecord(userId, r)))
        set({ syncing: false })
        return
      }
      // 기존 사용자: cloud 기록으로 덮어쓰기 (cloud 우선)
      saveRecords(cloudRecords)
      useStreakStore.getState().syncFromRecords(cloudRecords)
      set({ records: cloudRecords, syncing: false })
    } catch {
      set({ syncing: false })
    }
  },
}))
