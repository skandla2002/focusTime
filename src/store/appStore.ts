import { create } from 'zustand'
import type { Screen, AppUser } from '../types'

export type AppScreen = Screen | 'login'

interface AppState {
  screen: AppScreen
  showInterstitial: boolean
  focusLock: boolean
  user: AppUser | null
  // actions
  navigate: (screen: AppScreen) => void
  triggerInterstitial: () => void
  dismissInterstitial: () => void
  setFocusLock: (focusLock: boolean) => void
  setUser: (user: AppUser | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  screen: 'home',
  showInterstitial: false,
  focusLock: false,
  user: null,

  navigate: (screen: AppScreen) => {
    set({ screen })
  },

  triggerInterstitial: () => {
    set({ showInterstitial: true })
  },

  dismissInterstitial: () => {
    set({ showInterstitial: false })
  },

  setFocusLock: (focusLock: boolean) => {
    set({ focusLock })
  },

  setUser: (user: AppUser | null) => {
    set({ user })
  },
}))
