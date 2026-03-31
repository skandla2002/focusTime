# Test Annotations

> 규칙: .workflowSvc/ai/workflow-rules.md 참조

## 기록 형식

```markdown
### [ISSUE-XXX] YYYY-MM-DD
- 대상: 소스 파일 경로
- 테스트: 테스트 파일 경로
- 케이스: `테스트명` — PASS / FAIL
- 결과: 통과 / 실패 (실패 시 buglist.md 등록)
```

---

## 기록

<!-- 테스트 결과를 아래에 추가 -->

### [ISSUE-058~060] 2026-03-31
- 대상 테스트 파일: `src/store/timerStore.test.ts`
- 대상 테스트 파일: `src/store/appStore.test.ts`
- 대상 테스트 파일: `src/screens/TimerScreen.test.tsx`
- 케이스: `[timerStore] should switch back to focus without creating a session when a break timer completes` — PASS
- 케이스: `[timerStore] should wait in idle focus mode when foreground resume finishes a break` — PASS
- 케이스: `[appStore] triggerStatisticsAd should show interstitial on first call` — PASS
- 케이스: `[appStore] should restore statistics ad cooldown from localStorage on initialization` — PASS
- 케이스: `[TimerScreen] should show today focused time beneath the timer controls` — PASS
- 결과: 통과 (`npm run test -- src/store/timerStore.test.ts src/store/appStore.test.ts src/screens/TimerScreen.test.tsx`, `npm run typecheck`)
