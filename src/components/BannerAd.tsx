import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Capacitor } from '@capacitor/core'
import { AdMob, BannerAdOptions, BannerAdPosition, BannerAdSize } from '@capacitor-community/admob'
import styles from './BannerAd.module.css'

const BANNER_AD_ID = {
  android: import.meta.env.VITE_ADMOB_BANNER_ID_ANDROID ?? 'ca-app-pub-3940256099942544/6300978111',
  ios: import.meta.env.VITE_ADMOB_BANNER_ID_IOS ?? 'ca-app-pub-3940256099942544/2934735716',
}

async function showBanner() {
  await AdMob.showBanner({
    adId: Capacitor.getPlatform() === 'ios' ? BANNER_AD_ID.ios : BANNER_AD_ID.android,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: 0,
    isTesting: import.meta.env.DEV,
  } satisfies BannerAdOptions)
}

export function BannerAd() {
  const { t } = useTranslation()
  const isNative = Capacitor.isNativePlatform()

  useEffect(() => {
    if (!isNative) {
      return
    }

    AdMob.initialize({ testingDevices: [], initializeForTesting: import.meta.env.DEV })
      .then(() => showBanner())
      .catch(console.error)

    return () => {
      AdMob.removeBanner().catch(console.error)
    }
  }, [isNative])

  if (isNative) {
    return null
  }

  return (
    <div className={styles.bannerAd} aria-label="Advertisement">
      {t('ads.banner')}
    </div>
  )
}
