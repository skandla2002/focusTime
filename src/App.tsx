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
import { LoginScreen } from './screens/LoginScreen'
import { StatisticsScreen } from './screens/StatisticsScreen'
import { TimerScreen } from './screens/TimerScreen'
import { useAppStore } from './store/appStore'
import { useStudyStore } from './store/studyStore'
import { useTimerStore } from './store/timerStore'
import { trackEvent } from './utils/analytics'
import { subscribeAuthState } from './utils/cloudStorage'

function AppContent() {
  const { screen, navigate, setUser } = useAppStore()
  const { onBackground, onForeground } = useTimerStore()
  const { syncFromCloud } = useStudyStore()

  // 인증 상태 구독 — 로그인/로그아웃 시 user 세팅 및 cloud sync
  useEffect(() => {
    const unsubscribe = subscribeAuthState((authUser) => {
      setUser(authUser)
      if (authUser) {
        syncFromCloud(authUser.id).catch(console.error)
        navigate('home')
      }
    })
    return unsubscribe
  }, [setUser, syncFromCloud, navigate])

  // 화면 전환 Analytics
  useEffect(() => {
    void trackEvent('screen_view', { screen_name: screen })
  }, [screen])

  // 백그라운드/포그라운드 타이머 보정 (ISSUE-016)
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return
    const listener = CapApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) onForeground()
      else onBackground()
    })
    return () => { void listener.then((s) => s.remove()) }
  }, [onBackground, onForeground])

  const isLoginScreen = screen === 'login'

  return (
    <div className="app">
      {screen === 'login' && <LoginScreen />}
      {screen === 'home' && <HomeScreen />}
      {screen === 'timer' && <TimerScreen />}
      {screen === 'statistics' && <StatisticsScreen />}
      {screen === 'goal' && <GoalScreen />}

      {!isLoginScreen && <BannerAd />}
      {!isLoginScreen && <Navigation current={screen} onNavigate={navigate} />}
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
          <div className="error-fallback-body">
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
