# Workflow Rules (AI 전용)

## 1. brief → plan 변환 규칙

brief.md `## 입력` 섹션에 내용이 있을 때만 처리한다. 내용이 없으면 아무것도 하지 않는다.

AI가 `## 입력` 내용을 읽고 아래를 판단하여 plan.md에 이슈별로 묶어 작성한다.

| 판단 항목 | 기준 | plan 내 위치 |
| ---- | ---- | ---- |
| 구현 이슈 | 만들거나 수정할 기능 | ISSUE 구현 내용 |
| 🔍 사전 조사 | 기술/API/라이브러리 파악 필요 | 해당 ISSUE 내 포함 |
| 🤔 의사결정 | 방향이 둘 이상, 사람 판단 필요 | 해당 ISSUE 내 포함 |
| ⚠ 참고/제약 | 스펙, 제약 조건, 주의사항 | 해당 ISSUE 내 포함 |

### plan.md 작성 시 필수 동기화 규칙

brief.md 분석 후 plan.md에 새 이슈를 추가할 때 **반드시** 아래 두 곳을 동시에 업데이트해야 한다:

1. **`## 이슈 목록` 섹션** (상단 체크리스트) — 한 줄 요약 추가

   ```markdown
   - [ ] ISSUE-NNN: 제목 _(Phase 2)_   ← Phase 2는 Capacitor 필요 이슈에만 표기
   ```

2. **`## 이슈 상세` 섹션** — 전체 상세 내용 추가

> ⚠ 이슈 목록과 이슈 상세가 불일치하는 상태로 두지 않는다. 상세만 추가하거나 목록만 추가하는 것은 금지.

### brief.md 입력 내용 삭제 규칙 (필수)

plan.md 이슈 추가가 완료된 직후, brief.md `## 입력` 섹션의 내용을 반드시 삭제한다.

삭제 후 `## 입력` 섹션은 아래 상태로 유지한다:

```markdown
## 입력

<!-- 여기에 요청 내용을 작성하세요. AI가 읽은 후 이 영역은 비워집니다. -->
```

- `## 사용 방법`, `## 요청 목록` 등 다른 섹션은 절대 수정하지 않는다.
- 삭제하지 않고 남겨두는 것은 금지. plan.md 업데이트와 brief.md 초기화는 항상 한 세트로 처리한다.

## 2. DO 단계 규칙

- 소스 수정 → 단위 테스트 작성 → 실행 → 통과 → 다음 진행 (미통과 시 중단)
- 오류 발생 → .workflowSvc/docs/bugs/buglist.md 등록 → plan.md 이슈 추가
- 이슈 전환 전 → 반드시 커밋 먼저

## 3. 테스트 작성 규칙

- 수정 코드 기반 단위 테스트 작성
- 기존 테스트 약화 금지 (skip / any / mock 남용)
- 테스트명: `[대상] should [동작] when [조건]`
- 기록: .workflowSvc/workflow/test-annotations.md

## 4. 커밋 메시지 형식

```text
[PROJ-000] Jira 제목          ← plan.md 이슈에 Jira 번호 있을 때만 (없으면 이 줄 생략)

한글: 변경 내용 요약

English: Summary of changes
```

- Jira 번호는 plan.md 이슈 상세의 `Jira:` 필드에서 가져옴
- 한글/영어 본문은 둘 다 필수 작성
- 제목줄과 본문 사이 빈 줄 필수

## 5. Prompt Store 저장 규칙

brief.md 입력을 plan.md 이슈로 변환하여 **상세 조건·제약을 규칙화하는 시점**에
`.workflowSvc/workflow/prompt-store.md`에 아래 내용을 저장한다.

저장 항목:

1. **원문**: brief.md `## 입력`에서 읽은 사용자 요청 텍스트 (삭제 전 그대로)
2. **상세화된 규칙/조건**: plan.md 이슈 상세에서 확정된 조건·제약 목록
3. **관련 이슈 번호**

저장 형식:

```markdown
### [YYYY-MM-DD] ISSUE-NNN: 제목

**원문 (brief.md 입력)**
> 사용자가 작성한 원문 그대로

**상세화된 규칙 / 조건**
- 조건 1
- 조건 2

**관련 이슈**: ISSUE-NNN
```

저장 타이밍:

- plan.md 이슈 상세 작성 완료 → brief.md 초기화 → **prompt-store.md 저장** 순서로 처리
- 단순 버그 리포트나 1줄 이하 요청은 저장 생략 가능

## 6. 결과 라우팅

| 완료 항목 | 결과 기록 위치 |
| ---- | ---- |
| 🔍 사전 조사 | .workflowSvc/workflow/research.md |
| 🤔 의사결정 | .workflowSvc/workflow/decisions.md |
| 📋 ISSUE 구현 | .workflowSvc/workflow/implementation.md → test-annotations.md |
| 버그 발생 | .workflowSvc/docs/bugs/buglist.md → plan.md 이슈 추가 |
| 이슈 완료 | .workflowSvc/workflow/3.review.md → commit → .workflowSvc/docs/ 업데이트 |
