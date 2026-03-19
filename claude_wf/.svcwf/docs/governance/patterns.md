# Patterns — Android

> 프로젝트에서 사용하는 아키텍처·디자인 패턴과 금지 패턴을 정의합니다.
> 패턴 도입·변경 시 `.workflowSvc/docs/decisions/` ADR에 근거를 남깁니다.

---

## 아키텍처 패턴

| 패턴 | 적용 영역 | 비고 |
| ---- | ---- | ---- |
| MVVM | 전체 구조 | ViewModel ↔ UI, 단방향 데이터 흐름 |
| Clean Architecture (선택) | 레이어 분리 | Presentation / Domain / Data |
| Repository Pattern | 데이터 접근 | 데이터 소스 추상화 |
| UseCase (선택) | 비즈니스 로직 단위 | ViewModel 복잡도 낮춤 |

> 프로젝트 복잡도에 따라 Clean Architecture / UseCase 생략 가능

---

## 데이터 흐름

```text
UI (Compose / View)
  ↑↓ (UiState / Event)
ViewModel
  ↑↓ (Domain Model)
UseCase (선택)
  ↑↓
Repository (Interface)
  ↑↓
Data Source (Room / Retrofit / DataStore)
```

---

## ViewModel 패턴

```kotlin
// UiState — sealed class 또는 data class
data class HomeUiState(
    val isLoading: Boolean = false,
    val items: List<Item> = emptyList(),
    val error: String? = null
)

// ViewModel
class HomeViewModel @Inject constructor(
    private val getItemsUseCase: GetItemsUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    fun loadItems() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            getItemsUseCase()
                .onSuccess { items -> _uiState.update { it.copy(items = items, isLoading = false) } }
                .onFailure { e -> _uiState.update { it.copy(error = e.message, isLoading = false) } }
        }
    }
}
```

---

## Repository 패턴

```kotlin
// Domain Interface
interface ItemRepository {
    suspend fun getItems(): Result<List<Item>>
}

// Data Implementation
class ItemRepositoryImpl @Inject constructor(
    private val dao: ItemDao
) : ItemRepository {
    override suspend fun getItems(): Result<List<Item>> = runCatching {
        dao.getAll().map { it.toDomain() }
    }
}
```

---

## Compose UI 패턴

- Screen Composable은 ViewModel에서 `collectAsStateWithLifecycle()` 으로 상태 수집
- Stateless Composable: 상태와 콜백을 파라미터로 받아 재사용성 향상 (State Hoisting)
- 복잡한 UI는 Preview 함수(`@Preview`) 작성

---

## Anti-pattern (금지 패턴)

| 패턴 | 이유 | 대안 |
| ---- | ---- | ---- |
| God ViewModel | 단일 책임 원칙 위반 | UseCase로 로직 분리 |
| Context in ViewModel | 메모리 누수 | `ApplicationContext` 또는 Hilt 주입 |
| `GlobalScope` | 생명주기 미관리 | `viewModelScope` / `lifecycleScope` |
| `!!` 과용 | NullPointerException 위험 | `?.` / `?: return` / `requireNotNull` |
| Callback Hell | 가독성·오류 처리 어려움 | Coroutines + Flow |
| Magic Number | 가독성·유지보수 저하 | `companion object` 상수로 추출 |
| Entity ↔ UI 직접 연결 | 레이어 경계 위반 | Domain Model / DTO 매핑 |

---

## 에러 처리 패턴

```text
Repository : runCatching { } 으로 Result<T> 반환
ViewModel  : .onSuccess / .onFailure 로 UiState 업데이트
UI         : UiState.error != null 이면 Snackbar / Dialog 표시
```

---

## 비동기 / 스레드

- DB 작업: `Dispatchers.IO` (Room은 자동 처리)
- CPU 집약 작업: `Dispatchers.Default`
- UI 업데이트: `Dispatchers.Main` (StateFlow collect는 자동)
- Flow 변환은 `flowOn(Dispatchers.IO)` 사용
