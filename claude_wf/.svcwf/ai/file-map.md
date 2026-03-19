# File Map (Android Workflow)

> 진입점: Claude Code → `CLAUDE.md`

---

## 세션 시작 시 읽기

| 파일 | 목적 |
| ---- | ---- |
| `.workflowSvc/docs/architecture/structure.md` | 프로젝트 폴더 구조 파악 |
| `.workflowSvc/workflow/1.brief.md` | 현재 요청 확인 |
| `.workflowSvc/workflow/2.plan.md` | 승인된 `[x]` 이슈 확인 |
| `.workflowSvc/ai/rules.md` | 규칙 확인 |
| `.workflowSvc/docs/architecture/system-overview.md` | 시스템 상세 구조 파악 (작성된 경우) |

---

## 작업 중 쓰기

| 파일 | 언제 |
| ---- | ---- |
| `.workflowSvc/workflow/implementation.md` | DO 단계 TODO 체크 |
| `.workflowSvc/workflow/test-annotations.md` | 테스트 실행 결과 |
| `.workflowSvc/workflow/research.md` | 조사 완료 후 |
| `.workflowSvc/workflow/decisions.md` | 의사결정 완료 후 |
| `.workflowSvc/docs/bugs/buglist.md` | 버그 발견 즉시 |
| `.workflowSvc/workflow/3.review.md` | 이슈 완료 후 커밋 전 |

---

## 참조

| 파일 | 목적 |
| ---- | ---- |
| `.workflowSvc/docs/specs/dod.md` | 완료 기준 |
| `.workflowSvc/ai/workflow-rules.md` | 워크플로우 상세 규칙 |
| `.workflowSvc/docs/bugs/buglist.md` | 기존 버그 현황 |
| `.workflowSvc/docs/decisions/adr-template.md` | 기술 결정 기록 형식 |
| `.workflowSvc/docs/governance/naming.md` | 네이밍 규칙 |
| `.workflowSvc/docs/governance/patterns.md` | 아키텍처·디자인 패턴 |
| `.workflowSvc/docs/governance/style.md` | 코드 스타일 |
| `.workflowSvc/docs/governance/functions/kotlin.md` | Kotlin 함수 패턴 |

---

## Android 주요 소스 경로 (프로젝트에 맞게 수정)

| 경로 | 내용 |
| ---- | ---- |
| `app/src/main/java/<package>/` | Kotlin 소스 루트 |
| `app/src/main/res/` | 리소스 (layout, drawable, values 등) |
| `app/src/test/java/` | 단위 테스트 |
| `app/src/androidTest/java/` | Instrumented 테스트 |
| `app/build.gradle.kts` | 앱 모듈 빌드 스크립트 |
| `build.gradle.kts` | 루트 빌드 스크립트 |
| `gradle/libs.versions.toml` | 버전 카탈로그 (Version Catalog 사용 시) |
