import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob'
import styles from './BannerAd.module.css'

const BANNER_AD_ID = {
  android: import.meta.env.VITE_ADMOB_BANNER_ID_ANDROID ?? 'ca-app-pub-3940256099942544/6300978111', // test ID
  ios: import.meta.env.VITE_ADMOB_BANNER_ID_IOS ?? 'ca-app-pub-3940256099942544/2934735716',       // test ID
}

async function showBanner() {
  await AdMob.showBanner({
    adId: Capacitor.getPlatform() === 'ios' ? BANNER_AD_ID.ios : BANNER_AD_ID.android,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: 60, // 탭바 높이만큼 위로
    isTesting: import.meta.env.DEV,
  } satisfies BannerAdOptions)
}

/**
 * BannerAd
 * - 네이티브(Android/iOS): AdMob 배너를 탭바 위에 고정 표시
 * - 웹(개발): placeholder UI 표시
 */
export function BannerAd() {
  const isNative = Capacitor.isNativePlatform()

  useEffect(() => {
    if (!isNative) return
    AdMob.initialize({ testingDevices: [], initializeForTesting: import.meta.env.DEV })
      .then(() => showBanner())
      .catch(console.error)

    return () => {
      AdMob.removeBanner().catch(console.error)
    }
  }, [isNative])

  // 네이티브에서는 AdMob SDK가 직접 렌더링 — DOM 요소 불필요
  if (isNative) return null

  return (
    <div className={styles.bannerAd} aria-label="Advertisement">
      광고 영역 (AdMob Banner)
    </div>
  )
}
