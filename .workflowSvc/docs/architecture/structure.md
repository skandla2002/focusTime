# Project Structure

> Auto-generated: 2026-03-14 by `.workflowSvc/ai/generate-preprompt.js`
> Review this file at session start to confirm the live project layout.

---

## High-level Directory Roles

| Path | Role |
| ---- | ---- |
| public/ | Static assets served directly by Vite. |
| src/ | React application source, screens, stores, types, and utilities. |

---

## Directory Tree

```text
forcusTimer/
├── public/
└── src/
    ├── components/
    ├── screens/
    ├── store/
    ├── types/
    └── utils/
```

---

## Governance Status

| Status | File | Purpose |
| ---- | ---- | ---- |
| OK | `.workflowSvc/docs/governance/naming.md` | Naming conventions |
| OK | `.workflowSvc/docs/governance/patterns.md` | Preferred architectural patterns |
| OK | `.workflowSvc/docs/governance/style.md` | Shared code style guidance |
| OK | `.workflowSvc/docs/governance/functions/javascript.md` | JavaScript and TypeScript function rules |
| N/A | `.workflowSvc/docs/governance/functions/java.md` | Template-only reference; Java is not used in this project. |

---

## Detailed Notes

### public/

- Holds static assets such as the timer SVG used by the app shell.

### src/

- `screens/` contains the main app views for home, timer, statistics, and goals.
- `store/` contains Zustand state for navigation, timer progress, study records, and goals.
- `components/` contains navigation and placeholder AdMob surfaces.
- `utils/` contains time formatting helpers and localStorage persistence.
- `types/` contains app-wide domain types and timer constants.
