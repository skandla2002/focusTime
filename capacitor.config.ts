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
        android: 'ca-app-pub-3940256099942544~3347511713', // 테스트용 — 실제 출시 전 교체
        ios: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',
      },
    },
  },
}

export default config
