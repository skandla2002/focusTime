# Documentation Checklist

## 구현 전 (Before DO)

- [ ] `.workflowSvc/workflow/1.brief.md` 요청 작성 완료
- [ ] `.workflowSvc/workflow/2.plan.md` 이슈 작성 및 `[x]` 승인 완료
- [ ] 사전 조사 필요 항목 → `.workflowSvc/workflow/research.md` 기록
- [ ] 의사결정 필요 항목 → 사람이 결정 후 `.workflowSvc/workflow/decisions.md` 기록
- [ ] `.workflowSvc/docs/specs/dod.md` 완료 기준 확인

## 구현 후 (After DO)

- [ ] `.workflowSvc/workflow/3.review.md` 체크리스트 전체 `[x]` 완료
- [ ] 단위 테스트 작성 및 통과 → `.workflowSvc/workflow/test-annotations.md` 기록
- [ ] 커밋 완료 (이슈 전환 전 필수)
- [ ] `npm run docs:finalize` 실행 → `.workflowSvc/docs/` 산출물 자동 반영
- [ ] 버그 발생 시 → `.workflowSvc/docs/bugs/buglist.md` 등록 및 `plan.md` 이슈 추가
