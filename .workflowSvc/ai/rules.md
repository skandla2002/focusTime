# Rules

## Core
- `[x]` 항목만 구현. 계획 외 파일 수정 금지
- strict typing 유지. lint/typecheck 통과 필수
- 소스 수정 시 단위 테스트 필수 (참조: workflow-rules.md)
- 판단 필요 시 사람에게 먼저 확인

## Do Not
- plan.md 미등록 파일 수정
- 의존성 무단 추가
- public API 서명 무단 변경
- any / unknown / ts-ignore 무단 사용
- 관련 없는 코드 리팩터링

## Code Style
- 프로젝트 lint + strict mode 준수
- ESLint / TypeScript 체크 통과

## Context
- 작업 전: .workflowSvc/workflow/2.plan.md → [x] 항목 확인
- 완료 기준: .workflowSvc/docs/specs/dod.md
- 빠른 파일 참조: .workflowSvc/ai/file-map.md
## Plan Archive
- 2.plan.md keeps only open issues.
- Completed checklist items move to history.md.
- Completed detailed specs move to .workflowSvc/workflow/completed-details.md.
