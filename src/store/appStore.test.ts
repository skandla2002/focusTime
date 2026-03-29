import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAppStore } from './appStore'

describe('appStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-29T10:00:00.000Z'))
    useAppStore.setState({
      screen: 'home',
      showInterstitial: false,
      focusLock: false,
      user: null,
      lastStatisticsAdAt: null,
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
})
