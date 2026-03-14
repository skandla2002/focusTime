# Development Workflow

```text
BRIEF → PLAN → DO → REVIEW → COMMIT → DOCS
```

상세 규칙: `.workflowSvc/ai/workflow-rules.md`

---

## 단계별 설명

| 단계 | 담당 | 위치 | 설명 |
| ---- | ---- | ---- | ---- |
| 1. BRIEF | 사람 | `.workflowSvc/workflow/1.brief.md` | 요청·아이디어를 자유 형식으로 작성 |
| 2. PLAN | AI | `.workflowSvc/workflow/2.plan.md` | AI가 이슈 작성 → 사람이 `[x]` 승인 |
| 3. DO | AI | `.workflowSvc/workflow/implementation.md` | `[x]` 이슈만 구현, 단위 테스트 필수 |
| 4. REVIEW | AI+사람 | `.workflowSvc/workflow/3.review.md` | 체크리스트 통과 확인 |
| 5. COMMIT | AI | git | 이슈 전환 전 반드시 커밋 먼저 |
| 6. DOCS | AI | `.workflowSvc/docs/` | `npm run docs:finalize`로 산출물 반영 |

---

## 보조 흐름

- **버그 발생** → `.workflowSvc/docs/bugs/buglist.md` 등록 → `.workflowSvc/workflow/2.plan.md` 이슈 추가
- **사전 조사** → `.workflowSvc/workflow/research.md` 기록
- **의사결정** → `.workflowSvc/workflow/decisions.md` 기록 → 기술 결정은 `.workflowSvc/docs/decisions/` ADR
