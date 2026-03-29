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

### 이슈 상세 필수 포함 항목 — 작업 비용 한 줄 요약

이슈 상세(`## 이슈 상세`)를 작성할 때 출처(`> 출처:`) 바로 다음 줄에 아래 형식의 **작업 비용 한 줄**을 반드시 추가한다:

```markdown
- ⏱ 예상: AI N분 / 시니어 N분 | 🤖 Subagent: 없음
- ⏱ 예상: AI N분 / 시니어 N분 | 🤖 Subagent: Explore (사용 이유)
```

| 항목 | 설명 |
| ---- | ---- |
| **AI N분** | Claude가 이 이슈를 단독 처리할 때의 예상 소요 시간 |
| **시니어 N분** | 10년차 개발자가 처리할 때의 예상 소요 시간 |
| **Subagent** | 서브에이전트 사용 여부. 불필요하면 `없음`, 필요하면 에이전트 이름과 사용 이유 기재 |

사용 가능한 Subagent 목록: `general-purpose`, `Explore`, `Plan`

예시:

```markdown
### ISSUE-NNN: 제목

> 출처: brief.md — 설명

- ⏱ 예상: AI 30분 / 시니어 15분 | 🤖 Subagent: Explore (현재 구현 파악)

- 배경: ...
```

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

## 6. 이슈 완료 마킹 규칙

이슈 작업이 완료되면 plan.md 이슈 상세의 **완료 기준 바로 다음 줄**에 아래 형식으로 완료 마크를 추가한다:

```markdown
- ✅ 완료 (YYYY-MM-DD HH:MM): 구현 요약 — 수정 파일, 테스트 결과 등
```

- 날짜·시간: 커밋 완료 시각 기준 (`HH:MM` 불명 시 `--:--` 사용)
- 요약: 실제 수정 내용과 테스트 결과를 1줄로 기재
- 이 마크가 있어야 "완료 이슈"로 인정되며 history.md 이력 등록 대상이 됨

> ⚠ 기존 형식(`완료 기준: ... ✅` 또는 파일 `[x]` 전체)도 완료로 인정하나, 신규 이슈부터는 반드시 위 형식 사용

## 7. 이슈 완료 후 이력 등록 규칙

이슈 커밋이 완료된 직후 아래 세 곳을 순서대로 업데이트한다.

### Step 1 — plan.md 이슈 상세의 ⏱ 예상 줄에 실제 시간 추가

```markdown
<!-- 변경 전 -->
- ⏱ 예상: AI 30분 / 시니어 15분 | 🤖 Subagent: 없음

<!-- 변경 후 -->
- ⏱ 예상: AI 30분 / 시니어 15분 | 🤖 Subagent: 없음 | ✅ 실제: 25분
```

- 실제 시간은 이슈 작업 시작부터 커밋 완료까지 소요된 시간을 기준으로 추정 기재한다.
- 이미 완료 표시(`✅ 완료 YYYY-MM-DD`)가 있는 이슈는 해당 줄 옆에 실제 시간을 추가한다.

### Step 2 — history.md에 항목 추가

```markdown
### YYYY-MM-DD HH:MM | ISSUE-NNN: 제목

- ⏱ 예상: AI N분 / 시니어 N분 | 🤖 Subagent: 없음 | ✅ 실제: N분
- 수정: `src/file1.tsx`, `src/store/file2.ts`
- 요약: 변경 내용 한 줄 요약
```

- 완료 날짜·시간: 커밋 시각 기준 (`YYYY-MM-DD HH:MM`)
- 수정 파일: 실제 변경된 파일 목록 (최대 5개, 초과 시 `외 N개` 표기)
- 요약: 이슈 상세의 완료 기준 첫 번째 항목 또는 한 줄 요약
- 최신 이슈가 위에 오도록 목록 맨 위에 추가

### Step 3 — plan.md 이슈 목록의 체크 상태 확인

- `[x]` 체크 유지 (이미 완료 승인된 이슈이므로 변경 불필요)

## 7. 결과 라우팅

| 완료 항목 | 결과 기록 위치 |
| ---- | ---- |
| 🔍 사전 조사 | .workflowSvc/workflow/research.md |
| 🤔 의사결정 | .workflowSvc/workflow/decisions.md |
| 📋 ISSUE 구현 | .workflowSvc/workflow/implementation.md → test-annotations.md |
| 버그 발생 | .workflowSvc/docs/bugs/buglist.md → plan.md 이슈 추가 |
| 이슈 완료 | .workflowSvc/workflow/3.review.md → commit → .workflowSvc/docs/ 업데이트 |

### 7-1. review 문서 언어 규칙

- `.workflowSvc/workflow/3.review.md`의 템플릿과 신규 기록은 기본적으로 한글로 작성한다.
- 섹션명(`기록 형식`, `기록`), 본문 설명, 체크리스트 문구, `수정사항:` 라인은 한글 유지가 원칙이다.
- 커밋 메시지 항목은 기존 규칙대로 `한글` / `English` 두 줄을 함께 기록한다.

## 8. Plan Archive Rules
### plan.md scope
- 2.plan.md must stay lean and contain only not-yet-completed issues.
- Completed issues must not remain in either:
  - the issue checklist section
  - the issue detail section
### required archive flow on completion
When an issue is completed and recorded, update the workflow files in this order:
1. Add the completion summary to .workflowSvc/workflow/history.md
2. Move the completed checklist item from 2.plan.md into the history.md section ## Completed Issue List (Moved From plan.md)
3. Move the full completed issue detail section from 2.plan.md into .workflowSvc/workflow/completed-details.md
4. Remove that completed checklist item and detailed section from .workflowSvc/workflow/2.plan.md
### archive formatting
- history.md keeps:
  - compact completed issue list
  - chronological completion history entries
- completed-details.md keeps:
  - the original detailed issue specs that were previously stored in 2.plan.md
- If multiple issues are completed together, archive all of them in the same pass so 2.plan.md never grows with stale completed content.

