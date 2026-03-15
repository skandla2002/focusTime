import { test, expect } from '@playwright/test'
import { gotoApp, navigateTo } from './helpers'

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp(page)
  })

  test('앱 초기 진입 시 홈 화면이 표시된다', async ({ page }) => {
    // 홈 탭이 active(aria-current=page) 상태
    const homeBtn = page.getByRole('button', { name: 'Home' })
    await expect(homeBtn).toHaveAttribute('aria-current', 'page')
  })

  test('타이머 탭 클릭 시 타이머 화면으로 이동한다', async ({ page }) => {
    await navigateTo(page, 'Timer')
    const timerBtn = page.getByRole('navigation').getByRole('button', { name: 'Timer', exact: true })
    await expect(timerBtn).toHaveAttribute('aria-current', 'page')
    // 타이머 시작 버튼 존재 확인
    await expect(page.getByRole('button', { name: 'Start timer' })).toBeVisible()
  })

  test('통계 탭 클릭 시 통계 화면으로 이동한다', async ({ page }) => {
    await navigateTo(page, 'Statistics')
    const statsBtn = page.getByRole('navigation').getByRole('button', { name: 'Statistics', exact: true })
    await expect(statsBtn).toHaveAttribute('aria-current', 'page')
  })

  test('목표 탭 클릭 시 목표 화면으로 이동한다', async ({ page }) => {
    await navigateTo(page, 'Goal')
    const goalBtn = page.getByRole('navigation').getByRole('button', { name: 'Goal', exact: true })
    await expect(goalBtn).toHaveAttribute('aria-current', 'page')
  })

  test('탭 간 자유롭게 이동할 수 있다', async ({ page }) => {
    await navigateTo(page, 'Timer')
    await navigateTo(page, 'Statistics')
    await navigateTo(page, 'Goal')
    await navigateTo(page, 'Home')
    const homeBtn = page.getByRole('navigation').getByRole('button', { name: 'Home', exact: true })
    await expect(homeBtn).toHaveAttribute('aria-current', 'page')
  })
})
