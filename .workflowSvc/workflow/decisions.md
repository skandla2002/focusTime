# Decisions

plan.md의 🤔 의사결정 항목이 `[x]` 완료되면 결정 내용을 여기에 기록합니다.
작업 범위/우선순위/방향에 관한 결정을 담습니다.
기술적 설계 결정(ADR)은 `.workflowSvc/docs/decisions/` 에 별도 기록합니다.

## 기록 형식

```markdown
### [DECISION-XXX] [결정 제목] — YYYY-MM-DD
- **출처**: 2.plan.md DECISION-XXX
- **선택지**: A안 / B안 / 기타
- **결정**: 선택한 방향
- **결정자**: 사람 / AI / 협의
- **이유**: 왜 이렇게 결정했는가
- **영향 범위**: 어떤 파일/기능/이슈에 영향을 주는가
```

---

## 결정 기록

<!-- 2.plan.md 의사결정 항목 완료 후 결정 내용을 아래에 추가하세요 -->

### [DECISION-001] 모드 전환 시 타이머 잔여 시간은 store에 모드별로 보존 — 2026-03-29
- **출처**: ISSUE-051
- **선택지**: 전환 시 항상 초기화 / 모드별 잔여 시간 별도 보존
- **결정**: `timerStore.savedModeState`에 focus/break 상태를 따로 보존하고, 복귀 시 `paused` 상태로 복원
- **결정자**: AI
- **이유**: 휴식 탭으로 잠깐 이동했다가 복귀해도 집중 세션이 초기화되지 않도록 UX를 보존하기 위해
- **영향 범위**: `src/store/timerStore.ts`, `src/store/timerStore.test.ts`

---

### [DECISION-002] 스크린샷 공유는 Web Share 파일 공유 우선, 미지원 시 PNG 다운로드 fallback — 2026-03-29
- **출처**: ISSUE-052
- **선택지**: 텍스트 공유 유지 / 스크린샷 파일 공유 + 다운로드 fallback
- **결정**: `html2canvas`로 현재 화면을 PNG로 캡처하고, `navigator.share({ files })` 가능 시 파일 공유, 아니면 다운로드 처리
- **결정자**: AI
- **이유**: 모바일 공유 UX를 강화하면서도 데스크톱·미지원 환경에서 기능이 끊기지 않게 하기 위해
- **영향 범위**: `src/utils/share.ts`, `src/utils/share.test.ts`, `src/screens/StatisticsScreen.tsx`
