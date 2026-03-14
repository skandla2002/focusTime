import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

vi.mock('@capacitor/core', () => ({
  Capacitor: {
    isNativePlatform: vi.fn(() => false),
    getPlatform: vi.fn(() => 'web'),
  },
}))

vi.mock('@capacitor/app', () => ({
  App: {
    addListener: vi.fn(async () => ({ remove: vi.fn() })),
  },
}))

vi.mock('@capacitor-community/admob', () => ({
  AdMob: {
    initialize: vi.fn(() => Promise.resolve()),
    showBanner: vi.fn(() => Promise.resolve()),
    removeBanner: vi.fn(() => Promise.resolve()),
    prepareInterstitial: vi.fn(() => Promise.resolve()),
    showInterstitial: vi.fn(() => Promise.resolve()),
    addListener: vi.fn(async () => ({ remove: vi.fn() })),
  },
  BannerAdSize: { ADAPTIVE_BANNER: 'ADAPTIVE_BANNER' },
  BannerAdPosition: { BOTTOM_CENTER: 'BOTTOM_CENTER' },
  InterstitialAdPluginEvents: {
    Loaded: 'Loaded',
    Dismissed: 'Dismissed',
  },
}))

vi.mock('@capacitor/local-notifications', () => ({
  LocalNotifications: {
    requestPermissions: vi.fn(() => Promise.resolve({ display: 'granted' })),
    schedule: vi.fn(() => Promise.resolve()),
    cancel: vi.fn(() => Promise.resolve()),
  },
}))

vi.mock('@sentry/react', () => ({
  init: vi.fn(),
  captureException: vi.fn(),
  ErrorBoundary: ({ children }: { children: unknown }) => children,
}))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
  localStorage.clear()
})
