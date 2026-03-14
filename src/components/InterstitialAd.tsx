import { useEffect } from 'react'
import { useAppStore } from '../store/appStore'

/**
 * InterstitialAd - AdMob interstitial placeholder
 * In production: initialize AdMob, preload interstitial, show on trigger
 * Triggered after: timer completion, statistics screen navigation
 */
export function InterstitialAd() {
  const { showInterstitial, dismissInterstitial } = useAppStore()

  useEffect(() => {
    if (showInterstitial) {
      // Auto-dismiss after 5 seconds in dev (production: user must close)
      const timer = setTimeout(dismissInterstitial, 5000)
      return () => clearTimeout(timer)
    }
  }, [showInterstitial, dismissInterstitial])

  if (!showInterstitial) return null

  return (
    <div className="interstitial-overlay" onClick={dismissInterstitial}>
      <div className="interstitial-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
          광고
        </div>
        <div className="interstitial-ad-area">
          AdMob Interstitial Ad
          <br />
          <span style={{ fontSize: 12 }}>(전면 광고 영역)</span>
        </div>
        <button className="interstitial-close" onClick={dismissInterstitial}>
          닫기
        </button>
      </div>
    </div>
  )
}
