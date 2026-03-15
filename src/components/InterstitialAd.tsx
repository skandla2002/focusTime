import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Capacitor } from '@capacitor/core'
import { AdMob, AdOptions, InterstitialAdPluginEvents } from '@capacitor-community/admob'
import { useAppStore } from '../store/appStore'
import styles from './InterstitialAd.module.css'

const INTERSTITIAL_AD_ID = {
  android: import.meta.env.VITE_ADMOB_INTERSTITIAL_ID_ANDROID ?? 'ca-app-pub-3940256099942544/1033173712',
  ios: import.meta.env.VITE_ADMOB_INTERSTITIAL_ID_IOS ?? 'ca-app-pub-3940256099942544/4411468910',
}

async function prepareInterstitial() {
  const options: AdOptions = {
    adId: Capacitor.getPlatform() === 'ios' ? INTERSTITIAL_AD_ID.ios : INTERSTITIAL_AD_ID.android,
    isTesting: import.meta.env.DEV,
  }

  await AdMob.prepareInterstitial(options)
}

export function InterstitialAd() {
  const { t } = useTranslation()
  const { showInterstitial, dismissInterstitial } = useAppStore()
  const isNative = Capacitor.isNativePlatform()

  useEffect(() => {
    if (!isNative) {
      return
    }

    prepareInterstitial().catch(console.error)

    const loadedListener = AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
      if (showInterstitial) {
        AdMob.showInterstitial().catch(console.error)
      }
    })

    const dismissedListener = AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
      dismissInterstitial()
      prepareInterstitial().catch(console.error)
    })

    return () => {
      loadedListener.then((listener) => listener.remove())
      dismissedListener.then((listener) => listener.remove())
    }
  }, [dismissInterstitial, isNative, showInterstitial])

  useEffect(() => {
    if (!isNative || !showInterstitial) {
      return
    }

    AdMob.showInterstitial().catch(console.error)
  }, [isNative, showInterstitial])

  useEffect(() => {
    if (isNative || !showInterstitial) {
      return
    }

    const timer = setTimeout(dismissInterstitial, 5000)
    return () => clearTimeout(timer)
  }, [dismissInterstitial, isNative, showInterstitial])

  if (isNative || !showInterstitial) {
    return null
  }

  return (
    <div className={styles.interstitialOverlay} onClick={dismissInterstitial}>
      <div className={styles.interstitialCard} onClick={(event) => event.stopPropagation()}>
        <div className={styles.interstitialLabel}>{t('ads.interstitialLabel')}</div>
        <div className={styles.interstitialAdArea}>
          {t('ads.interstitialBody')}
          <br />
          <span className={styles.interstitialAdSubtext}>{t('ads.interstitialSubtext')}</span>
        </div>
        <button type="button" className={styles.interstitialClose} onClick={dismissInterstitial}>
          {t('common.close')}
        </button>
      </div>
    </div>
  )
}
