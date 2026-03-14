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

interface StudyState {
  records: StudyRecord[]
  addSession: (session: FocusSession) => void
  getTodayMinutes: () => number
  getWeekData: () => { date: string; minutes: number }[]
  getMonthData: () => { date: string; minutes: number }[]
  getTotalMinutes: () => number
}

export const useStudyStore = create<StudyState>((set, get) => ({
  records: getRecords(),

  addSession: (session: FocusSession) => {
    const { records } = get()
    const updated = addSessionToRecords(records, session)
    saveRecords(updated)
    set({ records: updated })
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
}))
