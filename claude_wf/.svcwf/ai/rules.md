# Rules (Android)

## Core

- `[x]` 항목만 구현. 계획 외 파일 수정 금지
- Kotlin 타입 안전성 유지 — `!!` 남용 금지, 가능하면 `?.` / `?: return` 사용
- 소스 수정 시 단위 테스트 필수 (`./gradlew test` 통과)
- 판단 필요 시 사람에게 먼저 확인

## Do Not

- `plan.md` 미등록 파일 수정
- `build.gradle` 의존성 무단 추가
- public 함수/클래스 시그니처 무단 변경
- `@SuppressWarnings` / `// noinspection` 무단 사용
- 관련 없는 코드 리팩터링

## Build & Lint

- `./gradlew build` 통과 필수
- ktlint: `./gradlew ktlintCheck` 통과 필수 (설정된 경우)
- detekt: `./gradlew detekt` 통과 필수 (설정된 경우)
- `./gradlew test` 통과 필수

## Android-Specific

- UI 로직을 ViewModel에, 비즈니스 로직을 UseCase/Repository에 분리
- Context 를 ViewModel에 직접 주입 금지 (ApplicationContext만 허용)
- Room Entity에 비즈니스 로직 포함 금지
- Coroutine: `GlobalScope` 사용 금지, `viewModelScope` / `lifecycleScope` 사용
- Compose: `remember`/`State` 남용 주의, 상태는 ViewModel에서 관리

## Context

- 작업 전: `.workflowSvc/workflow/2.plan.md` → `[x]` 항목 확인
- 완료 기준: `.workflowSvc/docs/specs/dod.md`
- 파일 참조: `.workflowSvc/ai/file-map.md`
