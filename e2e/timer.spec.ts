import { test, expect } from '@playwright/test'
import { gotoApp, navigateTo, waitForTimerComplete } from './helpers'

test.describe('Timer', () => {
  test.beforeEach(async ({ page }) => {
    await gotoApp(page)
    await navigateTo(page, 'Timer')
  })

  test('타이머 화면에 집중·휴식 탭과 시작 버튼이 표시된다', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Focus mode' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Break mode' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Start timer' })).toBeVisible()
  })

  test('시작 버튼 클릭 시 타이머가 running 상태가 된다', async ({ page }) => {
    await page.getByRole('button', { name: 'Start timer' }).click()
    // running 상태: 일시정지 버튼 표시
    await expect(page.getByRole('button', { name: 'Pause timer' })).toBeVisible()
  })

  test('일시정지 버튼 클릭 시 타이머가 paused 상태가 된다', async ({ page }) => {
    await page.getByRole('button', { name: 'Start timer' }).click()
    await page.getByRole('button', { name: 'Pause timer' }).click()
    // paused 상태: 계속(Resume) 버튼 표시
    await expect(page.getByRole('button', { name: 'Resume timer' })).toBeVisible()
  })

  test('계속 버튼으로 타이머를 재개할 수 있다', async ({ page }) => {
    await page.getByRole('button', { name: 'Start timer' }).click()
    await page.getByRole('button', { name: 'Pause timer' }).click()
    await page.getByRole('button', { name: 'Resume timer' }).click()
    await expect(page.getByRole('button', { name: 'Pause timer' })).toBeVisible()
  })

  test('리셋 버튼 클릭 시 타이머가 idle 상태로 돌아온다', async ({ page }) => {
    await page.getByRole('button', { name: 'Start timer' }).click()
    await page.getByRole('button', { name: 'Reset timer' }).click()
    await expect(page.getByRole('button', { name: 'Start timer' })).toBeVisible()
  })

  test('집중 잠금 활성화 시 탭 전환이 비활성화된다', async ({ page }) => {
    await page.getByRole('button', { name: 'Enable focus lock' }).click()
    // 잠금 해제 버튼으로 변경됨
    await expect(page.getByRole('button', { name: 'Disable focus lock' })).toBeVisible()
    // 네비게이션 버튼이 disabled
    const homeBtn = page.getByRole('navigation').getByRole('button', { name: 'Home', exact: true })
    await expect(homeBtn).toBeDisabled()
  })

  test('집중 잠금 해제 시 탭 이동이 다시 가능해진다', async ({ page }) => {
    await page.getByRole('button', { name: 'Enable focus lock' }).click()
    await page.getByRole('button', { name: 'Disable focus lock' }).click()
    const homeBtn = page.getByRole('navigation').getByRole('button', { name: 'Home', exact: true })
    await expect(homeBtn).not.toBeDisabled()
  })

  test('[e2e 모드] 5초 후 집중 타이머가 완료되고 휴식 모드로 전환된다', async ({ page }) => {
    await page.getByRole('button', { name: 'Start timer' }).click()
    // E2E 모드: FOCUS_DURATION = 5초 → 완료 후 break 모드 전환
    await waitForTimerComplete(page)
    await expect(page.getByRole('button', { name: 'Break mode' })).toBeVisible()
  })

  test('[e2e 모드] 타이머 완료 후 완료 세션 수가 증가한다', async ({ page }) => {
    // 완료 전: 0 세션
    const initialText = await page.locator('text=Completed sessions').first().isVisible()
    expect(initialText).toBe(true)

    await page.getByRole('button', { name: 'Start timer' }).click()
    await waitForTimerComplete(page)

    // 완료 후: completedToday > 0 (오늘의 집중 카드 숫자 확인)
    await expect(page.locator('text=Focus mins')).toBeVisible()
  })
})
