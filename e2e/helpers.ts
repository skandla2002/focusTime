import type { Page } from '@playwright/test'

/** 앱을 E2E 모드(타이머 5초 단축)로 열기 */
export async function gotoApp(page: Page, path = '/') {
  const sep = path.includes('?') ? '&' : '?'
  await page.goto(`${path}${sep}e2e=1`)
  // i18n 로딩 대기
  await page.waitForSelector('[role="navigation"]')
}

/** 탭 네비게이션 — nav 내부의 버튼만 정확히 매칭 */
export async function navigateTo(page: Page, label: 'Home' | 'Timer' | 'Statistics' | 'Goal') {
  await page.getByRole('navigation').getByRole('button', { name: label, exact: true }).click()
}

/** 포커스 타이머가 완료되어 break 모드로 전환될 때까지 대기 (E2E 모드 5초 + 여유 2초) */
export async function waitForTimerComplete(page: Page) {
  await page.waitForSelector('[aria-label="Break mode"]', { timeout: 10_000 })
}
