# Definition of Done (DoD) — Android

A task is considered complete only if ALL of the following are satisfied:

## 빌드 & 정적 분석

- [ ] `./gradlew build` 성공 (컴파일 오류 없음)
- [ ] `./gradlew lint` — 신규 Lint 경고 없음
- [ ] `./gradlew ktlintCheck` — 스타일 위반 없음 (ktlint 사용 시)
- [ ] `./gradlew detekt` — 정적 분석 경고 없음 (detekt 사용 시)

## 테스트

- [ ] `./gradlew test` — 모든 단위 테스트 통과
- [ ] 변경된 로직에 대한 신규/수정 단위 테스트 존재
- [ ] 기존 테스트 회귀 없음 (`@Ignore` 임의 추가 금지)

## 코드 품질

- [ ] ViewModel에 Context 직접 주입 없음
- [ ] `GlobalScope` 사용 없음
- [ ] `!!` 불필요한 사용 없음
- [ ] `plan.md` 미등록 파일 수정 없음
- [ ] 무단 의존성 추가 없음

## 워크플로우

- [ ] `plan.md` 해당 이슈 항목 `[x]` 체크 완료
- [ ] `implementation.md` 업데이트
- [ ] `test-annotations.md` 업데이트
- [ ] `3.review.md` 체크리스트 통과
- [ ] 커밋 완료 (커밋 메시지 형식 준수)
