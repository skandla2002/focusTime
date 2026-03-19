# Workflow Rules

## 1. BRIEF -> PLAN

- Read the request from `1.brief.md`.
- Convert the request into one or more plan issues in `2.plan.md`.
- Keep both the issue checklist and issue detail sections in sync.
- After plan creation or update, clear the `## Input` section in `1.brief.md`.

Each issue should include:

- Goal
- Implementation scope
- Files to touch
- Research needed
- Open decisions
- Constraints or notes
- Verification needed
- Done criteria

## 2. DO

- Work on one approved issue at a time.
- Update `implementation.md` with the current TODO checklist.
- If new facts change the approach, record them in `research.md` or `decisions.md`.
- If you find a new bug outside scope, record it in `docs/bugs/buglist.md` instead of folding it into the current issue without approval.

## 3. VERIFY

- Run the smallest meaningful verification for the changed area.
- If you cannot run a required check, document the reason and the remaining risk.
- Android-specific changes should include at least one of:
  - automated test
  - lint/build verification
  - manual device/emulator verification note

## 4. REVIEW

- Write a short review record in `3.review.md`.
- Confirm scope, tests, rules, and documentation updates.

## 5. COMMIT

Use a simple commit format:

```text
[ISSUE-XXX] Short title

KR: what changed
EN: what changed
```

If the project has its own commit format, follow that instead.

## 6. DOCS

- Update architecture or workflow docs when behavior, structure, or operating steps changed.
- Keep templates concise and current.
