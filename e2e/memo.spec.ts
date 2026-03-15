/**
 * memo.spec.ts
 * 메모 기능 E2E 테스트
 *
 * ⚠ ISSUE-040 ~ ISSUE-042 구현 완료 후 test.skip 제거
 *   - ISSUE-040: FocusSession 메모 필드 + Dexie DB
 *   - ISSUE-041: 메모 입력 모달
 *   - ISSUE-042: MemoScreen (목록·검색)
 */
import { test, expect } from '@playwright/test'
import { gotoApp, navigateTo, waitForTimerComplete } from './helpers'

/** 각 테스트 전 IndexedDB 초기화 */
async function clearDb(page: import('@playwright/test').Page) {
  await page.evaluate(() => {
    return new Promise<void>((resolve, reject) => {
      const req = indexedDB.deleteDatabase('FocusTimerDB')
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  })
}

test.describe('메모 — 입력 모달 (ISSUE-041)', () => {
  test.skip(true, 'ISSUE-040~041 구현 후 활성화')

  test.beforeEach(async ({ page }) => {
    await gotoApp(page)
    await clearDb(page)
    await navigateTo(page, 'Timer')
  })

  test('집중 타이머 완료 후 메모 입력 모달이 표시된다', async ({ page }) => {
    await page.getByRole('button', { name: 'Start timer' }).click()
    await waitForTimerComplete(page)
    // 메모 입력 모달 대기
    await expect(page.getByRole('dialog', { name: /메모|memo/i })).toBeVisible({ timeout: 3_000 })
  })

  test('메모를 입력하고 저장하면 모달이 닫힌다', async ({ page }) => {
    await page.getByRole('button', { name: 'Start timer' }).click()
    await waitForTimerComplete(page)
    const modal = page.getByRole('dialog', { name: /메모|memo/i })
    await modal.getByRole('textbox').fill('오늘은 Playwright E2E 설정 작업')
    await modal.getByRole('button', { name: /저장|save/i }).click()
    await expect(modal).not.toBeVisible()
  })

  test('건너뜀 버튼 클릭 시 메모 없이 모달이 닫힌다', async ({ page }) => {
    await page.getByRole('button', { name: 'Start timer' }).click()
    await waitForTimerComplete(page)
    const modal = page.getByRole('dialog', { name: /메모|memo/i })
    await modal.getByRole('button', { name: /건너뜀|skip/i }).click()
    await expect(modal).not.toBeVisible()
  })

  test('같은 세션에 대해 메모 모달이 두 번 표시되지 않는다', async ({ page }) => {
    await page.getByRole('button', { name: 'Start timer' }).click()
    await waitForTimerComplete(page)
    const modal = page.getByRole('dialog', { name: /메모|memo/i })
    await modal.getByRole('button', { name: /건너뜀|skip/i }).click()
    // 타이머 화면 재방문
    await navigateTo(page, 'Home')
    await navigateTo(page, 'Timer')
    await expect(page.getByRole('dialog', { name: /메모|memo/i })).not.toBeVisible()
  })
})

test.describe('메모 — 목록 화면 (ISSUE-042)', () => {
  test.skip(true, 'ISSUE-042 구현 후 활성화')

  test.beforeEach(async ({ page }) => {
    await gotoApp(page)
    await clearDb(page)
  })

  test('메모 탭 이동 시 목록 화면이 표시된다', async ({ page }) => {
    await navigateTo(page, 'Memo')
    await expect(page.getByRole('heading', { name: /메모|memo/i })).toBeVisible()
  })

  test('저장된 메모가 없으면 빈 상태 UI가 표시된다', async ({ page }) => {
    await navigateTo(page, 'Memo')
    await expect(page.getByText(/메모가 없|no memo/i)).toBeVisible()
  })

  test('저장된 메모가 목록에 표시된다', async ({ page }) => {
    // 사전 조건: 집중 완료 후 메모 저장
    await navigateTo(page, 'Timer')
    await page.getByRole('button', { name: 'Start timer' }).click()
    await waitForTimerComplete(page)
    const modal = page.getByRole('dialog', { name: /메모|memo/i })
    await modal.getByRole('textbox').fill('Playwright 테스트 메모')
    await modal.getByRole('button', { name: /저장|save/i }).click()

    await navigateTo(page, 'Memo')
    await expect(page.getByText('Playwright 테스트 메모')).toBeVisible()
  })
})

test.describe('메모 — 검색 (ISSUE-042)', () => {
  test.skip(true, 'ISSUE-042 구현 후 활성화')

  async function seedMemo(page: import('@playwright/test').Page, memoText: string) {
    await navigateTo(page, 'Timer')
    await page.getByRole('button', { name: 'Start timer' }).click()
    await waitForTimerComplete(page)
    const modal = page.getByRole('dialog', { name: /메모|memo/i })
    await modal.getByRole('textbox').fill(memoText)
    await modal.getByRole('button', { name: /저장|save/i }).click()
  }

  test.beforeEach(async ({ page }) => {
    await gotoApp(page)
    await clearDb(page)
    await seedMemo(page, 'React 컴포넌트 리팩터링')
    // 두 번째 집중 세션을 위해 타이머 재시작 대기
    await page.waitForTimeout(500)
    await seedMemo(page, 'Playwright E2E 테스트 작성')
  })

  test('정확 검색: 검색어가 포함된 메모만 표시된다', async ({ page }) => {
    await navigateTo(page, 'Memo')
    // 검색 모드: 정확(exact)
    await page.getByRole('button', { name: /정확|exact/i }).click()
    await page.getByRole('searchbox').fill('React')
    await expect(page.getByText('React 컴포넌트 리팩터링')).toBeVisible()
    await expect(page.getByText('Playwright E2E 테스트 작성')).not.toBeVisible()
  })

  test('유사도 검색: 오타가 있어도 관련 메모가 반환된다', async ({ page }) => {
    await navigateTo(page, 'Memo')
    // 검색 모드: 유사도(fuzzy)
    await page.getByRole('button', { name: /유사도|fuzzy/i }).click()
    // 오타: "Reactt" → "React 컴포넌트 리팩터링" 매칭 기대
    await page.getByRole('searchbox').fill('Reactt')
    await expect(page.getByText('React 컴포넌트 리팩터링')).toBeVisible()
  })

  test('검색어 초기화 시 전체 목록이 복원된다', async ({ page }) => {
    await navigateTo(page, 'Memo')
    await page.getByRole('searchbox').fill('React')
    await page.getByRole('searchbox').clear()
    await expect(page.getByText('React 컴포넌트 리팩터링')).toBeVisible()
    await expect(page.getByText('Playwright E2E 테스트 작성')).toBeVisible()
  })
})
