# AGENTS.md

This file is loaded automatically at the start of every AI session.

## Project

FocusTimer is a Pomodoro-based study timer app. The MVP includes timer flows,
local study records, statistics charts, study-goal tracking, and placeholder
AdMob surfaces for future monetization.

## Session Start

1. Read `.workflowSvc/docs/architecture/structure.md` to confirm the current project layout.
   If it is missing, run `npm run preprompt` to regenerate it.
   Retry at most two times. If regeneration still fails, record the failure in `structure.md`
   and continue with the remaining session-start steps.
2. Read `.workflowSvc/workflow/1.brief.md` to understand the current request.
3. Read `.workflowSvc/workflow/2.plan.md` and only execute approved `[x]` issues.
4. Read `.workflowSvc/ai/rules.md`.
5. Read `.workflowSvc/docs/architecture/system-overview.md` when the file exists and has content.

## Workflow

```text
BRIEF -> PLAN -> DO -> REVIEW -> COMMIT -> DOCS
```

Detailed rules: `.workflowSvc/ai/workflow-rules.md`
File references: `.workflowSvc/ai/file-map.md`

## Core Rules

- Only execute approved `[x]` items.
- Run unit tests or the required verification whenever source files change.
- Commit before moving to the next issue when the workflow requires it.
- Ask the human before proceeding when judgment or product direction is unclear.

## Codex Notes

- Read and write files with shell commands or file tools.
- If context is still insufficient, run `npm run preprompt:approved` and use the output.
- Use Git for commits: `git commit -m "..."`.
