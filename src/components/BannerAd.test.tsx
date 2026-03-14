import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Capacitor } from '@capacitor/core'
import { AdMob } from '@capacitor-community/admob'
import { BannerAd } from './BannerAd'

describe('banner ad', () => {
  it('[BannerAd] should render the placeholder when the app runs on web', () => {
    render(<BannerAd />)

    expect(screen.getByLabelText('Advertisement')).toBeTruthy()
  })

  it('[BannerAd] should initialize and remove the native banner when the app runs on device', async () => {
    vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true)
    vi.mocked(Capacitor.getPlatform).mockReturnValue('android')

    const { unmount, container } = render(<BannerAd />)

    await waitFor(() => {
      expect(AdMob.initialize).toHaveBeenCalled()
      expect(AdMob.showBanner).toHaveBeenCalled()
    })

    expect(container.firstChild).toBeNull()

    unmount()

    await waitFor(() => {
      expect(AdMob.removeBanner).toHaveBeenCalled()
    })
  })
})
