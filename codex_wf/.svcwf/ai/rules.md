# Rules

## Core

- Only implement approved `[x]` plan items.
- Keep changes scoped to the active issue.
- Run relevant verification after source changes.
- Record blockers, research, and decisions in the workflow docs.

## Do Not

- Edit unrelated files without a reason tied to the active issue.
- Change plan scope silently.
- Commit secrets, keystores, `local.properties`, or release outputs.
- Skip tests without documenting why.
- Change product direction when the requirement is unclear.

## Android Focus

- Treat permissions, manifest edits, background behavior, notifications, billing, ads,
  analytics, and release signing as sensitive changes.
- For hybrid apps, keep native Android config and web-layer changes in sync.
- For release tasks, confirm current store policy and SDK requirements before implementation.

## Verification

- Native Android examples: `./gradlew test`, `./gradlew lint`, `./gradlew assembleDebug`
- Hybrid examples: `npm run test`, `npm run lint`, `npm run build`, `npx cap sync android`
- Use the real commands that match the project and note any gaps.
