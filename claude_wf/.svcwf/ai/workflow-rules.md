# Workflow Rules (AI 전용)

## 1. brief → plan 변환 규칙

`brief.md` `## 입력` 섹션에 내용이 있을 때만 처리한다. 내용이 없으면 아무것도 하지 않는다.

AI가 `## 입력` 내용을 읽고 아래를 판단하여 `plan.md`에 이슈별로 묶어 작성한다.

| 판단 항목 | 기준 | plan 내 위치 |
| ---- | ---- | ---- |
| 구현 이슈 | 만들거나 수정할 기능 | ISSUE 구현 내용 |
| 🔍 사전 조사 | 기술/라이브러리/API 파악 필요 | 해당 ISSUE 내 포함 |
| 🤔 의사결정 | 방향이 둘 이상, 사람 판단 필요 | 해당 ISSUE 내 포함 |
| ⚠ 참고/제약 | 스펙, 제약 조건, 주의사항 | 해당 ISSUE 내 포함 |

### plan.md 작성 시 필수 동기화 규칙

brief.md 분석 후 plan.md에 새 이슈를 추가할 때 **반드시** 아래 두 곳을 동시에 업데이트한다:

1. **`## 이슈 목록` 섹션** (상단 체크리스트) — 한 줄 요약 추가

   ```markdown
   - [ ] ISSUE-NNN: 제목 _(선택: 특이사항 태그)_
   ```

2. **`## 이슈 상세` 섹션** — 전체 상세 내용 추가

> ⚠ 이슈 목록과 이슈 상세가 불일치하는 상태로 두지 않는다.

### brief.md 입력 내용 삭제 규칙 (필수)

plan.md 이슈 추가 완료 직후, `brief.md` `## 입력` 섹션의 내용을 반드시 삭제한다.

삭제 후 `## 입력` 섹션은 아래 상태로 유지한다:

```markdown
## 입력

<!-- 여기에 요청 내용을 작성하세요. AI가 읽은 후 이 영역은 비워집니다. -->
```

- `## 사용 방법`, `## 요청 목록` 등 다른 섹션은 절대 수정하지 않는다.

---

## 2. DO 단계 규칙

- 소스 수정 → 단위 테스트 작성 → `./gradlew test` 실행 → 통과 → 다음 진행 (미통과 시 중단)
- 오류 발생 → `.workflowSvc/docs/bugs/buglist.md` 등록 → `plan.md` 이슈 추가
- 이슈 전환 전 → 반드시 커밋 먼저

### Android 빌드/검증 명령

```bash
./gradlew build               # 전체 빌드
./gradlew test                # 단위 테스트
./gradlew connectedCheck      # 기기/에뮬레이터 연결 테스트 (Instrumented)
./gradlew ktlintCheck         # 코드 스타일 검사
./gradlew detekt              # 정적 분석
./gradlew lint                # Android Lint
```

---

## 3. 테스트 작성 규칙

- 수정 코드 기반 단위 테스트 작성 (JUnit4/5 + Mockk 또는 Mockito)
- ViewModel 테스트: `kotlinx-coroutines-test` 사용
- Repository 테스트: Room in-memory DB 또는 Fake 구현체 사용
- 기존 테스트 약화 금지 (`@Ignore` / `@Suppress` 남용)
- 테스트명: `given_[조건]_when_[동작]_then_[기대결과]` 또는 백틱 형식
- 기록: `.workflowSvc/workflow/test-annotations.md`

---

## 4. 커밋 메시지 형식

```text
[ISSUE-NNN] 제목

한글: 변경 내용 요약

English: Summary of changes
```

- 제목줄과 본문 사이 빈 줄 필수
- 한글/영어 본문 둘 다 필수 작성
- Jira 티켓이 있으면 `[PROJ-000]` 를 앞에 추가

---

## 5. 결과 라우팅

| 완료 항목 | 결과 기록 위치 |
| ---- | ---- |
| 🔍 사전 조사 | `.workflowSvc/workflow/research.md` |
| 🤔 의사결정 | `.workflowSvc/workflow/decisions.md` |
| 📋 ISSUE 구현 | `.workflowSvc/workflow/implementation.md` → `test-annotations.md` |
| 버그 발생 | `.workflowSvc/docs/bugs/buglist.md` → `plan.md` 이슈 추가 |
| 이슈 완료 | `.workflowSvc/workflow/3.review.md` → commit → `.workflowSvc/docs/` 업데이트 |
