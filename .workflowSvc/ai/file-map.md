# File Map

> 이 파일은 Claude Code와 Codex 양쪽에서 공통으로 사용합니다.
> 진입점: Claude Code → `CLAUDE.md` / Codex CLI → `AGENTS.md` / Codex API → `node .workflowSvc/ai/generate-preprompt.js`

## 세션 시작 시 읽기

| 파일 | 목적 |
| ---- | ---- |
| .workflowSvc/docs/architecture/structure.md | 프로젝트 폴더 구조 파악 (없으면 `npm run preprompt` 실행 → 자동 생성) |
| .workflowSvc/workflow/1.brief.md | 현재 요청 확인 |
| .workflowSvc/workflow/2.plan.md | 승인된 [x] 이슈 확인 |
| .workflowSvc/ai/rules.md | 규칙 확인 |
| .workflowSvc/docs/architecture/system-overview.md | 시스템 상세 구조 파악 (작성된 경우) |

## 작업 중 쓰기

| 파일 | 언제 |
| ---- | ---- |
| .workflowSvc/workflow/implementation.md | DO 단계 TODO 체크 |
| .workflowSvc/workflow/test-annotations.md | 테스트 실행 결과 |
| .workflowSvc/workflow/research.md | 조사 완료 후 |
| .workflowSvc/workflow/decisions.md | 의사결정 완료 후 |
| .workflowSvc/docs/bugs/buglist.md | 버그 발견 즉시 |
| .workflowSvc/workflow/3.review.md | 이슈 완료 후 커밋 전 |

## 참조

| 파일 | 목적 |
| ---- | ---- |
| .workflowSvc/docs/specs/dod.md | 완료 기준 |
| .workflowSvc/ai/workflow-rules.md | 워크플로우 상세 규칙 |
| .workflowSvc/docs/bugs/buglist.md | 기존 버그 현황 |
| .workflowSvc/docs/architecture/improvements.md | 프로젝트 개선사항 목록 (작성된 경우) |
