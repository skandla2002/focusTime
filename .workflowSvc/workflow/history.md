# History

완료된 이슈의 이력을 기록합니다.
스프린트/버전 단위 상세 이력은 `.workflowSvc/docs/process/process.md`를 참조합니다.

## 기록 형식

```markdown
### YYYY-MM-DD HH:MM | ISSUE-NNN: 제목

- ⏱ 예상: AI N분 / 시니어 N분 | 🤖 Subagent: 없음 | ✅ 실제: N분
- 수정: `src/file1.tsx`, `src/store/file2.ts`
- 요약: 변경 내용 한 줄 요약
```

---

## 이력

<!-- 완료된 이슈를 아래에 추가 (최신순) -->

### 2026-03-29 17:30 | ISSUE-052: 공유하기 — 스크린샷(이미지) 파일 공유 지원 추가

- ⏱ 예상: AI 90분 / 시니어 2시간 | 🤖 Subagent: Explore (공유 버튼 현재 구현 위치 파악) | ✅ 실제: 25분
- 수정: `src/utils/share.ts`, `src/utils/share.test.ts`, `src/screens/StatisticsScreen.tsx`
- 요약: `html2canvas` 기반 스크린샷 공유 유틸을 추가하고, 파일 공유 미지원 환경에서는 PNG 다운로드로 fallback 하도록 통계 화면 공유 버튼을 확장함

---

### 2026-03-29 17:30 | ISSUE-051: 집중 중 휴식 탭 전환 시 집중 시간 보존

- ⏱ 예상: AI 60분 / 시니어 30분 | 🤖 Subagent: 없음 | ✅ 실제: 20분
- 수정: `src/store/timerStore.ts`, `src/store/timerStore.test.ts`
- 요약: 현재 브랜치의 모드별 잔여 시간 보존 로직이 요구사항과 일치함을 재검증하고, 복귀/리셋/자동 전환 케이스 테스트 기준으로 완료 처리

---

### 2026-03-29 16:28 | ISSUE-050: 잠금 상태에서 '시작'/'계속' 버튼 활성화

- ⏱ 예상: AI 10분 / 시니어 5분 | 🤖 Subagent: 없음 | ✅ 실제: 5분
- 수정: `src/screens/TimerScreen.tsx`
- 요약: `isPrimaryActionLocked` 변수 제거 — 잠금 ON 상태에서도 시작/계속 버튼 동작, 모드 탭·GNB는 여전히 차단

---

### 2026-03-29 16:28 | ISSUE-049: 타이머 잠금 버튼 — 텍스트 → 열쇠 아이콘(🔒/🔓)으로 교체

- ⏱ 예상: AI 10분 / 시니어 5분 | 🤖 Subagent: 없음 | ✅ 실제: 5분
- 수정: `src/screens/TimerScreen.tsx`, `src/screens/TimerScreen.module.css`
- 요약: 잠금 버튼 텍스트 → 🔒/🔓 이모지, min-width 92px → 44px 축소

---

### 2026-03-29 16:28 | ISSUE-048: 하단 배너 광고 레이아웃 수정

- ⏱ 예상: AI 10분 / 시니어 5분 | 🤖 Subagent: 없음 | ✅ 실제: 5분
- 수정: `src/components/BannerAd.module.css`
- 요약: `bottom: var(--nav-height)` → `bottom: 0` — 배너 최하단 고정, GNB가 배너 위에 표시

---

### 2026-03-29 16:28 | ISSUE-047: 통계 탭 전면 광고 1시간 쿨다운

- ⏱ 예상: AI 30분 / 시니어 15분 | 🤖 Subagent: 없음 | ✅ 실제: 20분
- 수정: `src/store/appStore.ts`, `src/components/Navigation.tsx`, `src/store/appStore.test.ts`
- 요약: `triggerStatisticsAd()` 1시간 쿨다운 로직, statistics 탭 클릭 시 호출

---

### 2026-03-29 16:28 | ISSUE-046: 집중 종료 알림 오버레이 — 클릭 시 닫기

- ⏱ 예상: AI 10분 / 시니어 5분 | 🤖 Subagent: 없음 | ✅ 실제: 10분
- 수정: `src/screens/TimerScreen.tsx`, `src/screens/TimerScreen.test.tsx`
- 요약: completionOverlay에 onClick 추가 — 클릭 시 즉시 닫혀 화면 조작 가능

---

### 2026-03-15 --:-- | ISSUE-045: 집중 타이머 실행 중 메모 사전 입력

- ⏱ 예상: 기록없음(규칙 도입 전) | 🤖 Subagent: 없음 | ✅ 실제: 기록없음
- 수정: `src/screens/TimerScreen.tsx`, `src/screens/TimerScreen.module.css`, `src/locales/ko/translation.json`, `src/locales/en/translation.json`, `src/locales/zh/translation.json`
- 요약: 타이머 running 중 인라인 메모 textarea 표시, 완료 시 IndexedDB 자동 저장 — `vitest run` 61 passed / 1 skipped

---

### 2026-03-15 --:-- | ISSUE-044: GNB 언어 선택 버튼 아이콘화

- ⏱ 예상: 기록없음(규칙 도입 전) | 🤖 Subagent: 없음 | ✅ 실제: 기록없음
- 수정: `src/components/LanguageSwitcher.tsx`, `src/components/LanguageSwitcher.module.css`
- 요약: 언어 버튼 텍스트("한국어"/"English"/"中文") → KO/EN/ZH 배지 아이콘으로 교체, 버튼 너비 축소

---

### 2026-03-15 --:-- | ISSUE-043: E2E 테스트 셋업 — Playwright 설치 및 메모 플로우 E2E 시나리오

- ⏱ 예상: 기록없음(규칙 도입 전) | 🤖 Subagent: 없음 | ✅ 실제: 기록없음
- 수정: `playwright.config.ts`, `e2e/helpers.ts`, `e2e/navigation.spec.ts`, `e2e/timer.spec.ts`, `e2e/memo.spec.ts`, `src/types/index.ts`, `package.json`, `vitest.config.ts`, `src/test/setup.ts`
- 요약: Playwright E2E 환경 구축 — navigation 5/5·timer 9/9 통과, memo 10/10 skipped(040~042 대기), 단위 테스트 62/62 통과

---

### 2026-03-15 --:-- | ISSUE-042: 메모 목록·검색 화면 (MemoScreen)

- ⏱ 예상: 기록없음(규칙 도입 전) | 🤖 Subagent: 없음 | ✅ 실제: 기록없음
- 수정: `src/screens/MemoScreen.tsx`, `src/screens/MemoScreen.module.css`, `src/types/index.ts`, `src/components/Navigation.tsx`, `src/App.tsx`
- 요약: 메모 목록 화면 신설 — 정확 검색(includes) · Fuse.js 유사도 검색, 5탭 내비게이션 추가

---

### 2026-03-15 --:-- | ISSUE-041: 집중 세션 완료 후 메모 입력 UI (모달)

- ⏱ 예상: 기록없음(규칙 도입 전) | 🤖 Subagent: 없음 | ✅ 실제: 기록없음
- 수정: `src/components/MemoInputModal.tsx`, `src/components/MemoInputModal.module.css`, `src/screens/TimerScreen.tsx`
- 요약: 집중 25분 완료 시 메모 입력 모달 표시, 저장 → IndexedDB 기록, 건너뜀 → 모달 닫기

---

### 2026-03-15 --:-- | ISSUE-040: FocusSession 메모 필드 추가 + IndexedDB(Dexie.js) 메모 저장소 구현

- ⏱ 예상: 기록없음(규칙 도입 전) | 🤖 Subagent: 없음 | ✅ 실제: 기록없음
- 수정: `src/types/index.ts`, `src/db/focusDb.ts`, `src/store/memoStore.ts`, `package.json`
- 요약: `FocusSession.memo` 필드 추가, Dexie.js IndexedDB 저장소 구현, `memoStore` Zustand 스토어 신규 생성

---

### 2026-03-15 --:-- | ISSUE-039: CSS Modules 완성도 점검

- ⏱ 예상: 기록없음(규칙 도입 전) | 🤖 Subagent: 없음 | ✅ 실제: 기록없음
- 수정: `src/App.tsx`
- 요약: 전역 클래스 직접 사용 3건(ErrorFallback) 발견·교체, `tsc --noEmit` 및 `vitest run` 57/57 통과

---

### 2026-03-15 --:-- | ISSUE-038: Figma 디자인 토큰 JSON 파이프라인

- ⏱ 예상: 기록없음(규칙 도입 전) | 🤖 Subagent: 없음 | ✅ 실제: 기록없음
- 수정: `src/tokens/design-tokens.json`, `scripts/generate-tokens.mjs`, `package.json`, `src/styles/globals.css`
- 요약: 16개 디자인 토큰 JSON 생성, `npm run tokens` → `_tokens.css` 자동 변환 스크립트 구축, prebuild 훅 적용

---

### 2026-03-15 --:-- | ISSUE-037: 화면 꺼짐 방지 (Wake Lock)

- ⏱ 예상: 기록없음(규칙 도입 전) | 🤖 Subagent: 없음 | ✅ 실제: 기록없음
- 수정: `src/screens/TimerScreen.tsx`
- 요약: `navigator.wakeLock.request('screen')` 타이머 running 시 취득, 정지·완료 시 해제, `visibilitychange` 포그라운드 복귀 시 재취득

---

### 2026-03-15 --:-- | ISSUE-033: AdMob 배너 광고가 GNB를 덮는 레이아웃 버그 수정

- ⏱ 예상: 기록없음(규칙 도입 전) | 🤖 Subagent: 없음 | ✅ 실제: 기록없음
- 수정: `src/components/BannerAd.tsx`, `src/components/Navigation.module.css`
- 요약: 배너 `margin: 60 → 0`, GNB `bottom: 0 → var(--banner-height)` — 배너·GNB 겹침 해소

---

### 2026-03-15 --:-- | ISSUE-031: APK 크래시 디버깅 — adb logcat 원인 분석 및 AdMob App ID 추가

- ⏱ 예상: 기록없음(규칙 도입 전) | 🤖 Subagent: 없음 | ✅ 실제: 기록없음
- 수정: `android/app/src/main/AndroidManifest.xml`, `capacitor.config.ts`
- 요약: `MobileAdsInitProvider` 크래시 원인(AdMob App ID 누락) 파악, AndroidManifest.xml `<meta-data>` 추가 및 capacitor.config.ts 테스트 ID 설정으로 정상 실행 확인
