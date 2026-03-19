# .workflowSvc 문서 구조

AI와 사람이 함께 사용하는 워크플로우 문서 폴더입니다.

---

## 폴더 구조

```text
.workflowSvc/
├── prd.md                          # Product Requirements Document
├── ai/
│   ├── rules.md                    # AI 핵심 규칙
│   ├── workflow-rules.md           # 워크플로우 상세 규칙
│   └── file-map.md                 # 파일 위치 맵
├── workflow/                       # 현재 진행 중인 작업
│   ├── 1.brief.md                  # 요청 입력
│   ├── 2.plan.md                   # 실행 계획 (승인 필요)
│   ├── 3.review.md                 # 이슈 완료 체크리스트
│   ├── implementation.md           # 구현 진행 기록
│   ├── test-annotations.md         # 테스트 결과 기록
│   ├── research.md                 # 사전 조사 결과
│   ├── decisions.md                # 의사결정 기록
│   ├── history.md                  # 완료 이력
│   └── blockers.md                 # 블로커 기록
└── docs/
    ├── README.md                   # 이 파일
    ├── changelog.md                # 변경 이력
    ├── specs/
    │   └── dod.md                  # Definition of Done
    ├── bugs/
    │   └── buglist.md              # 버그 목록
    ├── decisions/
    │   └── adr-template.md         # ADR (기술 결정 기록)
    ├── architecture/
    │   ├── structure.md            # 프로젝트 파일 구조
    │   └── system-overview.md      # 시스템 아키텍처 개요
    └── governance/
        ├── naming.md               # 네이밍 규칙
        ├── patterns.md             # 아키텍처·디자인 패턴
        ├── style.md                # 코드 스타일
        └── functions/
            └── kotlin.md           # Kotlin 함수 패턴
```

---

## 워크플로우 요약

```text
사람이 1.brief.md 입력
    ↓
AI가 2.plan.md 이슈 생성
    ↓
사람이 [x] 승인
    ↓
AI가 구현 (DO)
    ↓
AI가 3.review.md 체크
    ↓
커밋
    ↓
docs/ 업데이트
```
