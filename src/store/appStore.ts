import { create } from 'zustand'
import type { Screen } from '../types'

interface AppState {
  screen: Screen
  showInterstitial: boolean
  navigate: (screen: Screen) => void
  triggerInterstitial: () => void
  dismissInterstitial: () => void
}

export const useAppStore = create<AppState>((set) => ({
  screen: 'home',
  showInterstitial: false,

  navigate: (screen: Screen) => {
    set({ screen })
  },

  triggerInterstitial: () => {
    set({ showInterstitial: true })
  },

  dismissInterstitial: () => {
    set({ showInterstitial: false })
  },
}))
