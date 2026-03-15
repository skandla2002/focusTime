import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
      include: [
        'src/utils/time.ts',
        'src/utils/storage.ts',
        'src/utils/share.ts',
        'src/store/timerStore.ts',
        'src/store/studyStore.ts',
        'src/store/streakStore.ts',
        'src/components/Navigation.tsx',
        'src/components/BannerAd.tsx',
        'src/screens/GoalScreen.tsx',
      ],
      exclude: [
        'src/vite-env.d.ts',
        'src/utils/analytics.ts',
        'src/utils/cloudStorage.ts',
        'src/utils/notifications.ts',
        'android/**',
        '.storybook/**',
        'src/**/*.stories.tsx',
      ],
    },
  },
})
