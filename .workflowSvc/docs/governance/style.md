# Style Guide

> 코드 포맷·스타일 규칙입니다. 린트/포맷터 설정과 연동하여 유지합니다.
> 언어별 함수 규칙은 `functions/` 폴더를 참고하세요.

---

## 공통

| 항목 | 규칙 |
| ---- | ---- |
| 들여쓰기 | 스페이스 2칸 (또는 프로젝트 `.editorconfig` 기준) |
| 최대 줄 길이 | 100자 (또는 120자) |
| 줄 끝 | LF (CRLF 금지) |
| 파일 끝 | 빈 줄 1개 |
| 인코딩 | UTF-8 |

---

## 주석

```text
// ── 섹션 구분 ──────────────────────────────────────
// 단일 줄 주석: 코드 위에 작성 (옆 작성 금지)

/**
 * JSDoc / JavaDoc 스타일
 * 공개 함수·클래스에 필수 작성
 */

// TODO: 후속 작업이 필요한 경우
// FIXME: 알려진 버그/임시 우회
// NOTE: 중요 맥락 설명
```

---

## Import / 의존성 순서

```text
(예 — TypeScript/JavaScript)
1. Node.js 내장 모듈
2. 외부 라이브러리 (node_modules)
3. 내부 절대 경로 (@/...)
4. 내부 상대 경로 (./...)
--- 빈 줄 구분 ---
```

<!-- 프로젝트 린트 규칙(eslint-plugin-import 등)에 맞게 수정하세요 -->

---

## 코드 구조 순서 (클래스 내부)

```text
(예 — 클래스 멤버 순서)
1. static 상수
2. 인스턴스 필드
3. constructor
4. public 메서드
5. protected 메서드
6. private 메서드
7. static 메서드
```

---

## CSS / 스타일시트

| 항목 | 규칙 |
| ---- | ---- |
| 클래스명 | `kebab-case` |
| 변수명 (CSS Custom Property) | `--component-property` 형식 |
| 선택자 깊이 | 최대 3단계 |
| `!important` | 사용 금지 (불가피한 경우 주석 필수) |

---

## 린트 / 포맷터

| 도구 | 설정 파일 |
| ---- | ---- |
| ESLint / TSLint | `.eslintrc.*` |
| Prettier | `.prettierrc.*` |
| Stylelint | `.stylelintrc.*` |
| EditorConfig | `.editorconfig` |

> 린트 규칙이 이 문서와 충돌하면 **린트 설정이 우선**합니다.
> 충돌 시 이 문서를 업데이트하세요.

---

## 참고

- `naming.md` — 네이밍 규칙
- `patterns.md` — 아키텍처·디자인 패턴
- `functions/` — 언어별 함수 거버넌스
