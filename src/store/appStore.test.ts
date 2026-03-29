import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAppStore } from './appStore'

// localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })

describe('appStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-29T10:00:00.000Z'))
    localStorageMock.clear()
    useAppStore.setState({
      screen: 'home',
      showInterstitial: false,
      focusLock: false,
      user: null,
      lastStatisticsAdAt: null,
      visualMode: 'color',
    })
  })

  it('[appStore] triggerStatisticsAd should show interstitial on first call', () => {
    useAppStore.getState().triggerStatisticsAd()

    expect(useAppStore.getState().showInterstitial).toBe(true)
    expect(useAppStore.getState().lastStatisticsAdAt).toBe(Date.now())
  })

  it('[appStore] triggerStatisticsAd should skip ad within 1-hour cooldown', () => {
    useAppStore.getState().triggerStatisticsAd()
    useAppStore.setState({ showInterstitial: false })

    // 30분 경과
    vi.advanceTimersByTime(30 * 60 * 1000)
    useAppStore.getState().triggerStatisticsAd()

    expect(useAppStore.getState().showInterstitial).toBe(false)
  })

  it('[appStore] triggerStatisticsAd should show ad again after 1-hour cooldown expires', () => {
    useAppStore.getState().triggerStatisticsAd()
    useAppStore.setState({ showInterstitial: false })

    // 1시간 경과
    vi.advanceTimersByTime(3_600_000)
    useAppStore.getState().triggerStatisticsAd()

    expect(useAppStore.getState().showInterstitial).toBe(true)
  })

  it('[appStore] setVisualMode should update state and persist to localStorage', () => {
    useAppStore.getState().setVisualMode('grayscale')

    expect(useAppStore.getState().visualMode).toBe('grayscale')
    expect(localStorageMock.getItem('focustimer_visual_mode')).toBe('grayscale')
  })

  it('[appStore] setVisualMode back to color should update state and persist', () => {
    useAppStore.getState().setVisualMode('grayscale')
    useAppStore.getState().setVisualMode('color')

    expect(useAppStore.getState().visualMode).toBe('color')
    expect(localStorageMock.getItem('focustimer_visual_mode')).toBe('color')
  })
})
