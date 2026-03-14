# Naming Conventions

> 프로젝트 전반에 걸쳐 일관된 네이밍을 유지하기 위한 규칙입니다.
> 변경 시 `.workflowSvc/docs/decisions/` ADR에 근거를 남깁니다.

---

## 폴더 (Directory)

| 규칙 | 형식 | 예시 |
| ---- | ---- | ---- |
| 일반 폴더 | `kebab-case` | `user-profile/`, `order-service/` |
| 특수 폴더 | 프레임워크 컨벤션 따름 | `__tests__/`, `@types/` |
| 금지 | 공백·대문자·특수문자 | ~~`UserProfile/`~~, ~~`my folder/`~~ |

<!-- 프로젝트 컨벤션에 맞게 수정하세요 -->

---

## 파일 (File)

| 대상 | 형식 | 예시 |
| ---- | ---- | ---- |
| 소스 파일 (JS/TS) | `kebab-case` | `user-service.ts`, `format-date.ts` |
| 컴포넌트 파일 (React 등) | `PascalCase` | `UserCard.tsx`, `LoginForm.tsx` |
| 설정 파일 | `kebab-case` 또는 dot-notation | `tsconfig.json`, `.eslintrc.js` |
| 테스트 파일 | 대상 파일명 + `.test` / `.spec` | `user-service.test.ts` |

<!-- 프로젝트 컨벤션에 맞게 수정하세요 -->

---

## 클래스 (Class)

| 규칙 | 형식 | 예시 |
| ---- | ---- | ---- |
| 클래스명 | `PascalCase` | `UserService`, `OrderRepository` |
| 인터페이스 | `PascalCase` (I 접두사 선택) | `IUserService` 또는 `UserService` |
| 추상 클래스 | `Abstract` 접두사 (선택) | `AbstractBaseService` |
| Enum | `PascalCase` | `UserRole`, `OrderStatus` |
| Enum 값 | `UPPER_SNAKE_CASE` | `ADMIN`, `ORDER_PENDING` |

---

## 변수 / 함수 (Variable / Function)

| 대상 | 형식 | 예시 |
| ---- | ---- | ---- |
| 변수 | `camelCase` | `userId`, `orderCount` |
| 함수 | `camelCase` (동사 시작) | `getUserById()`, `formatDate()` |
| 상수 | `UPPER_SNAKE_CASE` | `MAX_RETRY`, `DEFAULT_TIMEOUT` |
| Boolean | `is` / `has` / `can` 접두사 | `isActive`, `hasPermission` |
| 핸들러 | `handle` + 이벤트명 | `handleSubmit`, `handleUserClick` |

---

## 데이터베이스 (DB)

| 대상 | 형식 | 예시 |
| ---- | ---- | ---- |
| 테이블명 | `snake_case` (복수) | `user_profiles`, `order_items` |
| 컬럼명 | `snake_case` | `created_at`, `user_id` |
| 인덱스 | `idx_{테이블}_{컬럼}` | `idx_users_email` |

<!-- 사용 DB에 맞게 수정하세요 -->

---

## 참고

- 결정 근거: `.workflowSvc/docs/decisions/`
- 린트 규칙과 충돌 시 린트 설정이 우선합니다.
