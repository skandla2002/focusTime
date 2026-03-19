# Naming Conventions — Android / Kotlin

> 프로젝트 전반에 걸쳐 일관된 네이밍을 유지하기 위한 규칙입니다.
> 변경 시 `.workflowSvc/docs/decisions/` ADR에 근거를 남깁니다.

---

## 패키지 (Package)

| 규칙 | 형식 | 예시 |
| ---- | ---- | ---- |
| 패키지명 | `all lowercase`, 점 구분 | `com.example.myapp.feature.home` |
| 레이어 구분 | `data`, `domain`, `presentation`, `di` | |

---

## 파일 (File)

| 대상 | 형식 | 예시 |
| ---- | ---- | ---- |
| Kotlin 소스 | `PascalCase` | `UserRepository.kt`, `HomeViewModel.kt` |
| Compose Screen | `PascalCase` + `Screen` 접미사 | `HomeScreen.kt`, `DetailScreen.kt` |
| XML 레이아웃 | `snake_case` (유형_이름) | `activity_main.xml`, `item_user.xml` |
| XML 드로어블 | `snake_case` | `ic_home.xml`, `bg_button_primary.xml` |
| XML 문자열 | `snake_case` | `app_name`, `error_network` |
| 테스트 파일 | 대상 클래스명 + `Test` | `HomeViewModelTest.kt` |

---

## 클래스 (Class)

| 대상 | 형식 | 예시 |
| ---- | ---- | ---- |
| Activity | `PascalCase` + `Activity` | `MainActivity`, `DetailActivity` |
| Fragment | `PascalCase` + `Fragment` | `HomeFragment` |
| ViewModel | `PascalCase` + `ViewModel` | `HomeViewModel` |
| Repository (인터페이스) | `PascalCase` + `Repository` | `UserRepository` |
| Repository (구현체) | `PascalCase` + `RepositoryImpl` | `UserRepositoryImpl` |
| UseCase | `동사PascalCase` + `UseCase` | `GetUserUseCase`, `SaveNoteUseCase` |
| Room Entity | `PascalCase` + `Entity` | `UserEntity` |
| Room DAO | `PascalCase` + `Dao` | `UserDao` |
| Hilt Module | `PascalCase` + `Module` | `DatabaseModule`, `NetworkModule` |
| Data class (Domain) | `PascalCase` | `User`, `Note` |
| DTO (Remote) | `PascalCase` + `Dto` | `UserDto` |
| Enum | `PascalCase` | `LoadState`, `UserRole` |
| Enum 값 | `UPPER_SNAKE_CASE` | `LOADING`, `SUCCESS`, `ERROR` |

---

## 변수 / 함수 (Variable / Function)

| 대상 | 형식 | 예시 |
| ---- | ---- | ---- |
| 변수 | `camelCase` | `userId`, `itemCount` |
| 함수 | `camelCase` (동사 시작) | `getUserById()`, `saveNote()` |
| 상수 (`companion object`) | `UPPER_SNAKE_CASE` | `MAX_RETRY`, `DEFAULT_TIMEOUT` |
| Boolean | `is` / `has` / `can` 접두사 | `isLoading`, `hasPermission` |
| Flow / StateFlow | 이름 + `Flow` / `State` | `userFlow`, `uiState` |
| backing property | `_` 접두사 | `_uiState` (private MutableStateFlow) |

---

## Room DB

| 대상 | 형식 | 예시 |
| ---- | ---- | ---- |
| 테이블명 (`tableName`) | `snake_case` (복수) | `users`, `focus_sessions` |
| 컬럼명 | `snake_case` | `created_at`, `user_id` |
| DB 파일명 | `snake_case` | `app_database` |

---

## Android 리소스 ID (XML)

| 대상 | 형식 | 예시 |
| ---- | ---- | ---- |
| View ID | `camelCase` | `btnSubmit`, `tvTitle`, `rvList` |
| 뷰 접두사 | 유형 약어 + 이름 | `btn`, `tv`, `rv`, `iv`, `et`, `cl` |
