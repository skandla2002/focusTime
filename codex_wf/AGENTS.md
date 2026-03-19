# AGENTS.md

This file is loaded automatically at the start of every AI session.
Copy this `codex_wf/` folder into the root of a new Android project and fill in
the project summary before the first working session.

## Project

**App Name**:
**Description**:
**App Type**: Native Android / Hybrid Android
**Tech Stack**:
**Min SDK**:
**Target SDK**:
**Package Name**:

## Session Start

1. Read `.workflowSvc/docs/architecture/structure.md` to confirm the current project layout.
   If it is missing, regenerate or rewrite it from the live source tree.
   Retry at most two times. If regeneration still fails, record the failure in `structure.md`
   and continue.
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
- Run the required verification whenever source files change.
- Use the project's real verification commands.
- Ask the human before release signing, production credentials, or Play Console steps.
- Do not commit secrets, keystores, local SDK paths, or generated release artifacts.

## Android Notes

- Keep `AndroidManifest.xml`, Gradle config, permissions, lifecycle handling, and release setup
  under explicit plan items.
- For release-related work, verify the latest Play Store requirements before changing SDK or policy-related settings.
- Treat background execution, notifications, alarms, and foreground services as high-risk areas that need tests or manual verification notes.

## Codex Notes

- Read and write files with shell commands or file tools.
- If project context is still insufficient, update `structure.md` and `system-overview.md` first.
- Use Git for commits: `git commit -m "..."`.
