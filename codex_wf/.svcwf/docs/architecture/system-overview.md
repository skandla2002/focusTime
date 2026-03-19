# System Overview

> Fill this in once the project structure is known.

## Technical Stack

- Language:
- UI:
- State management:
- Persistence:
- Networking:
- Android packaging:

## Entry Points

- Main Android entry:
- Main UI entry:
- Background entry points:

## Main Modules

| Path | Role |
| ---- | ---- |
| `app/src/main/AndroidManifest.xml` | Manifest, permissions, app components |
| `app/build.gradle` or `app/build.gradle.kts` | Android module config |
| `...` | Replace with live modules |

## Data Flow

```text
UI event
  -> state / view model
  -> domain / data layer
  -> local or remote persistence
  -> UI update
```

## Android-Specific Notes

- Required permissions:
- Notification or foreground-service behavior:
- Background or lifecycle-sensitive logic:
- Release/signing constraints:
