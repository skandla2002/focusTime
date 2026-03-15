import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.skandla2002ai.focustimer',
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
