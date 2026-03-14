import * as Sentry from '@sentry/react'
import { Capacitor } from '@capacitor/core'
import { App as CapApp } from '@capacitor/app'
import { useEffect } from 'react'
import './App.css'
import { BannerAd } from './components/BannerAd'
import { InterstitialAd } from './components/InterstitialAd'
import { Navigation } from './components/Navigation'
import { GoalScreen } from './screens/GoalScreen'
import { HomeScreen } from './screens/HomeScreen'
import { StatisticsScreen } from './screens/StatisticsScreen'
import { TimerScreen } from './screens/TimerScreen'
import { useAppStore } from './store/appStore'
import { useTimerStore } from './store/timerStore'
import { trackEvent } from './utils/analytics'

function AppContent() {
  const { screen, navigate } = useAppStore()
  const { onBackground, onForeground } = useTimerStore()

  useEffect(() => {
    void trackEvent('screen_view', { screen_name: screen })
  }, [screen])

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return
    }

    const listener = CapApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        onForeground()
      } else {
        onBackground()
      }
    })

    return () => {
      void listener.then((subscription) => subscription.remove())
    }
  }, [onBackground, onForeground])

  return (
    <div className="app">
      {screen === 'home' && <HomeScreen />}
      {screen === 'timer' && <TimerScreen />}
      {screen === 'statistics' && <StatisticsScreen />}
      {screen === 'goal' && <GoalScreen />}

      <BannerAd />
      <Navigation current={screen} onNavigate={navigate} />
      <InterstitialAd />
    </div>
  )
}

function ErrorFallback() {
  return (
    <div className="app">
      <div className="screen">
        <div className="card">
          <div className="card-title">App Error</div>
          <div style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
            Something unexpected happened. Restart the app and try again.
          </div>
        </div>
      </div>
    </div>
  )
}

export function App() {
  if (!import.meta.env.VITE_SENTRY_DSN) {
    return <AppContent />
  }

  return (
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>
      <AppContent />
    </Sentry.ErrorBoundary>
  )
}
