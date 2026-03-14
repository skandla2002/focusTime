import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.focustimer.app',
  appName: 'FocusTimer',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    AdMob: {
      appId: {
        android: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',
        ios: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',
      },
    },
  },
}

export default config
