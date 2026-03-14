import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAnalytics, isSupported, logEvent, type Analytics } from 'firebase/analytics'

export type AnalyticsEventName =
  | 'screen_view'
  | 'timer_start'
  | 'timer_pause'
  | 'timer_complete'
  | 'goal_set'
  | 'share_result'

type AnalyticsParams = Record<string, string | number | boolean | undefined>

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

let analyticsPromise: Promise<Analytics | null> | null = null

function hasFirebaseAnalyticsConfig(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.authDomain &&
      firebaseConfig.projectId &&
      firebaseConfig.storageBucket &&
      firebaseConfig.messagingSenderId &&
      firebaseConfig.appId &&
      firebaseConfig.measurementId
  )
}

async function getAnalyticsInstance(): Promise<Analytics | null> {
  if (!hasFirebaseAnalyticsConfig()) {
    return null
  }

  if (!analyticsPromise) {
    analyticsPromise = (async () => {
      const supported = await isSupported()
      if (!supported) {
        return null
      }

      const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
      return getAnalytics(app)
    })()
  }

  return analyticsPromise
}

export async function trackEvent(name: AnalyticsEventName, params: AnalyticsParams = {}): Promise<void> {
  try {
    const analytics = await getAnalyticsInstance()
    if (!analytics) {
      return
    }

    logEvent(analytics, name as string, params)
  } catch {
    // Analytics should never interrupt the main app flow.
  }
}
