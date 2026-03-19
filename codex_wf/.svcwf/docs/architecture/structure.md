# Project Structure

> Update this file at session start if the source tree changed.

## High-Level Directories

| Path | Role |
| ---- | ---- |
| `app/` | Android app module |
| `app/src/main/` | Android runtime sources, manifest, resources |
| `app/src/test/` | JVM unit tests |
| `app/src/androidTest/` | Instrumentation tests |
| `gradle/` | Shared Gradle configuration |
| `web/` or `src/` | Optional web layer for hybrid apps |

## Live Tree

```text
project-root/
  app/
  gradle/
  .workflowSvc/
```

## Notes

- Replace the tree above with the real project layout.
- For hybrid apps, document both the Android shell and the web app directories.
- Call out any special native modules, SDK wrappers, or generated folders worth knowing before edits.
