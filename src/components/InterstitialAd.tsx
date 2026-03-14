import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { AdMob, AdOptions, InterstitialAdPluginEvents } from '@capacitor-community/admob'
import { useAppStore } from '../store/appStore'

const INTERSTITIAL_AD_ID = {
  android: import.meta.env.VITE_ADMOB_INTERSTITIAL_ID_ANDROID ?? 'ca-app-pub-3940256099942544/1033173712', // test ID
  ios: import.meta.env.VITE_ADMOB_INTERSTITIAL_ID_IOS ?? 'ca-app-pub-3940256099942544/4411468910',       // test ID
}

async function prepareInterstitial() {
  const options: AdOptions = {
    adId: Capacitor.getPlatform() === 'ios' ? INTERSTITIAL_AD_ID.ios : INTERSTITIAL_AD_ID.android,
    isTesting: import.meta.env.DEV,
  }
  await AdMob.prepareInterstitial(options)
}

/**
 * InterstitialAd
 * - 네이티브: AdMob 전면 광고 로드 후 showInterstitial 트리거 시 표시
 * - 웹(개발): 5초 후 자동 닫히는 placeholder 오버레이 표시
 */
export function InterstitialAd() {
  const { showInterstitial, dismissInterstitial } = useAppStore()
  const isNative = Capacitor.isNativePlatform()

  // 네이티브: 전면 광고 사전 로드 및 표시
  useEffect(() => {
    if (!isNative) return

    prepareInterstitial().catch(console.error)

    const loadedListener = AdMob.addListener(
      InterstitialAdPluginEvents.Loaded,
      () => {
        if (showInterstitial) {
          AdMob.showInterstitial().catch(console.error)
        }
      }
    )

    const dismissedListener = AdMob.addListener(
      InterstitialAdPluginEvents.Dismissed,
      () => {
        dismissInterstitial()
        prepareInterstitial().catch(console.error) // 다음 표시를 위해 사전 로드
      }
    )

    return () => {
      loadedListener.then((l) => l.remove())
      dismissedListener.then((l) => l.remove())
    }
  }, [isNative, showInterstitial, dismissInterstitial])

  // 네이티브에서 showInterstitial 트리거 시 SDK 광고 표시
  useEffect(() => {
    if (!isNative || !showInterstitial) return
    AdMob.showInterstitial().catch(console.error)
  }, [isNative, showInterstitial])

  // 웹(개발): placeholder UI
  useEffect(() => {
    if (isNative || !showInterstitial) return
    const timer = setTimeout(dismissInterstitial, 5000)
    return () => clearTimeout(timer)
  }, [isNative, showInterstitial, dismissInterstitial])

  if (isNative || !showInterstitial) return null

  return (
    <div className="interstitial-overlay" onClick={dismissInterstitial}>
      <div className="interstitial-card" onClick={(e) => e.stopPropagation()}>
        <div className="interstitial-label">광고</div>
        <div className="interstitial-ad-area">
          AdMob Interstitial Ad
          <br />
          <span className="interstitial-ad-subtext">(전면 광고 영역)</span>
        </div>
        <button type="button" className="interstitial-close" onClick={dismissInterstitial}>
          닫기
        </button>
      </div>
    </div>
  )
}
