# CLAUDE.md — Android App Workflow Template

This file is loaded automatically at the start of every AI session.
Copy this entire `claude_wf/` folder to the root of your Android project and fill in the
`## Project` section below before the first session.

---

## Project

<!-- 프로젝트 이름과 한 줄 설명을 여기에 작성하세요 -->
<!-- 예: MyApp is a habit-tracking Android app built with Kotlin + Jetpack Compose. -->

**App Name**:
**Description**:
**Tech Stack**: Kotlin, Jetpack Compose, MVVM, Room, Hilt (필요에 따라 수정)
**Min SDK**: (예: 26)
**Target SDK**: (예: 35)
**Package**: (예: com.example.myapp)

---

## Session Start

1. Read `.workflowSvc/docs/architecture/structure.md` to confirm the current project layout.
   If it is missing or outdated, regenerate it:
   ```bash
   # 프로젝트 루트에서 실행 — src 트리를 structure.md에 저장
   find app/src/main/java -type f | sort > .workflowSvc/docs/architecture/structure.md
   ```
   Retry at most two times. If regeneration fails, document the failure in `structure.md` and continue.
2. Read `.workflowSvc/workflow/1.brief.md` to understand the current request.
3. Read `.workflowSvc/workflow/2.plan.md` and only execute approved `[x]` issues.
4. Read `.workflowSvc/ai/rules.md`.
5. Read `.workflowSvc/docs/architecture/system-overview.md` when it exists and has content.

---

## Workflow

```text
BRIEF → PLAN → DO → REVIEW → COMMIT → DOCS
```

Detailed rules: `.workflowSvc/ai/workflow-rules.md`
File references: `.workflowSvc/ai/file-map.md`

---

## Core Rules

- Only execute approved `[x]` items in `plan.md`.
- Run unit tests (`./gradlew test`) whenever source files change.
- Commit before moving to the next issue.
- Ask the human before proceeding when judgment or product direction is unclear.
