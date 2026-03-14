# Project Documentation

사람이 최종적으로 읽는 산출물 문서의 루트입니다.
`.workflowSvc/workflow/`가 작업 중 기록이라면, `.workflowSvc/docs/`는 공유/인수인계를 위한 확정 문서입니다.

## 문서 구성

- `architecture/`: 시스템 구조, 개선 포인트, 기술적 주의사항
- `api/`: API 인터페이스 명세
- `specs/`: 완료 기준(DoD), 시스템 계약(경계/불변 조건)
- `decisions/`: ADR(아키텍처 의사결정 기록)
- `bugs/`: 버그 이력 및 추적
- `.workflowSvc/workflow/`: 프로세스 안내/문서화 체크리스트
- `changelog.md`: 버전 단위 변경 요약
- `process/process.md`: 사람 관점의 작업 이력 요약

## 작성 원칙

- 독자 기준: "처음 보는 팀원"이 10분 안에 전체 맥락을 파악할 수 있어야 함
- 구현 세부보다 "무엇이 바뀌었고 왜 중요한지"를 우선 기록
- 상세 근거가 필요하면 `.workflowSvc/workflow/` 문서 경로를 함께 남김
- 변경 시점이 중요한 항목은 날짜(YYYY-MM-DD) 명시

## 최소 유지 항목

- `.workflowSvc/docs/changelog.md`: 변경 이력 최신 상태 유지
- `.workflowSvc/docs/specs/system-contract.md`: 경계/불변 조건 최신화
- `.workflowSvc/docs/architecture/system-overview.md`: 현재 구조와 진입점 반영
- API 공개 인터페이스 변경 시 `.workflowSvc/docs/api/api-spec.md` 업데이트

## 권장 업데이트 순서

1. 구현/테스트 완료 후 `.workflowSvc/workflow/3.review.md` 체크
2. `npm run docs:finalize` 실행
3. 자동 반영된 내용 중 `_(직접 기입)_` 항목 수동 보강
4. `.workflowSvc/docs/changelog.md`를 기준으로 누락 여부 최종 점검
