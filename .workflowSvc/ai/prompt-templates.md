# Prompt Templates

AI가 반복적으로 사용하는 프롬프트 패턴을 정의합니다.

---

## 프로젝트 분석 (최초 1회)

사람이 "프로젝트 분석해줘"라고 요청하면 아래 절차를 따릅니다.

**분석 제외 대상:** `.workflowSvc/ai/`, `.workflowSvc/workflow/`, `.workflowSvc/docs/`, `CLAUDE.md`, `AGENTS.md`, `README.md`, `package.json`

**절차:**

1. 프로젝트 전체 파일 트리 스캔 (제외 대상 폴더 무시)
2. 기술 스택, 진입점, 주요 모듈 역할 파악
3. 결과를 `.workflowSvc/docs/architecture/system-overview.md`에 기록
4. 분석 완료 후 사람에게 요약 보고

```text
[프로젝트 분석 요청]
.workflowSvc/ai/, .workflowSvc/workflow/, .workflowSvc/docs/, CLAUDE.md, AGENTS.md, README.md, package.json을 제외한
프로젝트 소스 전체를 분석하여 .workflowSvc/docs/architecture/system-overview.md에 기록해줘.
포함 항목: 기술 스택, 폴더 구조, 주요 모듈 역할, 진입점, 외부 의존성, 특이사항
```

---

## 개선사항 분석

사람이 "개선사항 알려줘"라고 요청하면 아래 절차를 따릅니다.

**전제:** `.workflowSvc/docs/architecture/system-overview.md`가 작성된 상태여야 합니다.

**절차:**

1. `.workflowSvc/docs/architecture/system-overview.md` 읽기
2. 소스 코드에서 개선 필요 영역 탐색
3. 우선순위(🔴높음 / 🟡중간 / 🟢낮음)로 분류
4. `.workflowSvc/docs/architecture/improvements.md`에 기록
5. 사람에게 요약 보고 후 → `.workflowSvc/workflow/1.brief.md`에 원하는 항목 작성 안내

```text
[개선사항 분석 요청]
.workflowSvc/docs/architecture/system-overview.md를 참조하여 프로젝트 개선사항을 분석하고
.workflowSvc/docs/architecture/improvements.md에 우선순위별로 기록해줘.
```

---

## 작업 시작 프롬프트

```text
다음 작업을 수행합니다:
- .workflowSvc/workflow/2.plan.md의 [x] 체크된 항목만 구현
- .workflowSvc/ai/rules.md 규칙 준수 (Do Not 섹션 포함)
- 완료 기준: .workflowSvc/docs/specs/dod.md 참조
```

---

## 코드 리뷰 요청

```text
변경된 코드에 대해 다음을 검토해주세요:
1. .workflowSvc/ai/rules.md Code Style 준수 여부
2. .workflowSvc/ai/rules.md Do Not 섹션 위반 여부
3. .workflowSvc/docs/specs/dod.md 완료 기준 충족 여부
```

---

## 버그 분석 요청

```text
버그 내용: [설명]
재현 방법: [단계]
예상 동작: [설명]
실제 동작: [설명]
관련 파일: [경로]
```

> 버그 분석 시 .workflowSvc/docs/architecture/system-overview.md를 참조하면 관련 모듈을 빠르게 파악할 수 있습니다.

---

## 설계 검토 요청

```text
설계 대상: [기능명]
배경 및 목적: [설명]
고려한 대안: [A안 / B안]
선택 이유: [설명]
```
