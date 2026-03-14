import type { Preview } from '@storybook/react'
import '../src/styles/globals.css'

// ── Capacitor mock ────────────────────────────────────────────────────────────
// Storybook runs in a browser without the Capacitor native bridge.
// Provide lightweight stubs so components that call Capacitor APIs don't throw.
// @ts-expect-error – injecting global mock
window.Capacitor = {
  isNativePlatform: () => false,
  getPlatform: () => 'web',
  isPluginAvailable: () => false,
}

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#0f0f23' }],
    },
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export default preview
