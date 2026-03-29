import { create } from 'zustand'
import type { Screen, AppUser } from '../types'

export type AppScreen = Screen | 'login'

interface AppState {
  screen: AppScreen
  showInterstitial: boolean
  focusLock: boolean
  user: AppUser | null
  lastStatisticsAdAt: number | null
  // actions
  navigate: (screen: AppScreen) => void
  triggerInterstitial: () => void
  dismissInterstitial: () => void
  triggerStatisticsAd: () => void
  setFocusLock: (focusLock: boolean) => void
  setUser: (user: AppUser | null) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  screen: 'home',
  showInterstitial: false,
  focusLock: false,
  user: null,
  lastStatisticsAdAt: null,

  navigate: (screen: AppScreen) => {
    set({ screen })
  },

  triggerInterstitial: () => {
    set({ showInterstitial: true })
  },

  dismissInterstitial: () => {
    set({ showInterstitial: false })
  },

  triggerStatisticsAd: () => {
    const { lastStatisticsAdAt } = get()
    const ONE_HOUR = 3_600_000
    const now = Date.now()
    if (!lastStatisticsAdAt || now - lastStatisticsAdAt >= ONE_HOUR) {
      set({ showInterstitial: true, lastStatisticsAdAt: now })
    }
  },

  setFocusLock: (focusLock: boolean) => {
    set({ focusLock })
  },

  setUser: (user: AppUser | null) => {
    set({ user })
  },
}))
