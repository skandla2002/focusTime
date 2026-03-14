# AGENTS.md

AI가 매 세션마다 자동으로 읽는 프로젝트 컨텍스트입니다.

## 프로젝트

AI와 사람이 함께 협업하는 SDLC 템플릿입니다.

## 세션 시작 시

1. `.workflowSvc/docs/architecture/structure.md` — 프로젝트 폴더 구조 확인 (없으면 `npm run preprompt` 실행하여 자동 생성, 최대 2회 시도 후 실패시 structure.md에 실패함 작성 후 다음단계 진행)
2. `.workflowSvc/workflow/1.brief.md` — 현재 요청 확인
3. `.workflowSvc/workflow/2.plan.md` — 승인된 `[x]` 이슈 확인
4. `.workflowSvc/ai/rules.md` — 규칙 확인
5. `.workflowSvc/docs/architecture/system-overview.md` — 시스템 상세 구조 파악 (파일이 있고 내용이 있을 때만)

## 워크플로우

```text
BRIEF → PLAN → DO → REVIEW → COMMIT → DOCS
```

상세 규칙: `.workflowSvc/ai/workflow-rules.md`
파일 참조: `.workflowSvc/ai/file-map.md`

## 핵심 규칙

- `[x]` 항목만 실행, 미승인 항목 절대 금지
- 소스 수정 시 단위 테스트 필수
- 이슈 전환 전 커밋 먼저
- 판단 필요 시 사람에게 먼저 확인

## Codex 특이사항

- 파일 읽기/쓰기는 shell 명령 또는 파일 도구를 사용
- 컨텍스트가 부족할 경우 `npm run preprompt:approved` 실행 후 출력 내용을 참조
- git 명령으로 커밋 실행 (`git commit -m "..."`)
