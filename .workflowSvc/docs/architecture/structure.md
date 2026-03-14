# Project Structure

> 자동 생성: 2026-03-06 | `.workflowSvc/ai/generate-preprompt.js`
> ⚠ **High-level 표·트리·거버넌스 현황**은 자동 생성됩니다.
> **상세 분석** 섹션은 AI에게 요청하거나 직접 작성하세요.

---

## High-level 폴더 역할

| 경로 | 역할 |
| ---- | ---- |
| (소스 폴더 없음) | 프로젝트 소스를 추가한 후 다시 실행하세요 |

---

## 폴더 트리

```text
AIRootTemplate/
(소스 폴더 없음)
```

---

## 거버넌스 구조 권장

> 코드 일관성 유지를 위해 아래 거버넌스 파일을 작성합니다.
> ✅ 작성됨  ⬜ 미작성 (클릭하여 작성)

| 상태 | 파일 | 내용 |
| ---- | ---- | ---- |
| ✅   | `.workflowSvc/docs/governance/naming.md`               | 폴더·클래스·파일 네이밍 규칙 |
| ✅ | `.workflowSvc/docs/governance/patterns.md`             | 아키텍처·디자인 패턴 |
| ✅    | `.workflowSvc/docs/governance/style.md`               | 코드 스타일 가이드 |
| ✅   | `.workflowSvc/docs/governance/functions/javascript.md` | JavaScript/TypeScript 함수 거버넌스 |
| ✅ | `.workflowSvc/docs/governance/functions/java.md`      | Java 함수 거버넌스 |

**Style 거버넌스** (`naming.md`, `patterns.md`, `style.md`)
- **naming** — 폴더·클래스·파일·변수 네이밍 규칙 (kebab-case, PascalCase 등)
- **patterns** — 아키텍처·디자인 패턴 및 금지 패턴
- **style** — 코드 포맷·주석·import 순서·린트 설정 연동

**함수 거버넌스** (`functions/`)
- **javascript.md** — JS/TS 함수 선언·비동기·타입·에러 처리 규칙
- **java.md** — Java 메서드·예외·Null 처리·어노테이션 규칙
- 추가 언어 필요 시 `functions/{언어}.md` 파일을 생성하세요.

---

## 상세 분석

> 아래 각 섹션은 해당 폴더의 상세 분석입니다.
> AI에게 요청하거나 `.workflowSvc/workflow/1.brief.md`에 작성하면 채워집니다.

<!-- 소스 폴더를 추가한 후 분석을 요청하세요 -->
