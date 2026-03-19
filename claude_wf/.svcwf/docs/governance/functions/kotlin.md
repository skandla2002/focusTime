# Kotlin Function Guide — Android

---

## 함수 선언 원칙

```kotlin
// ✅ 단일 책임: 하나의 함수는 하나의 일만
suspend fun getUserById(id: Long): Result<User> =
    runCatching { dao.findById(id).toDomain() }

// ✅ 반환 타입 명시 (public 함수)
fun formatDuration(seconds: Long): String { ... }

// ✅ 단일 식 함수 — 간단한 변환에 사용
fun Int.toDisplayString() = "$this 개"

// ❌ 피함 — 너무 많은 파라미터 (4개 초과 시 data class 고려)
fun createUser(name: String, age: Int, email: String, role: String, isActive: Boolean) = ...
// ✅ 대안
fun createUser(params: CreateUserParams) = ...
```

---

## Coroutine / suspend 함수

```kotlin
// ✅ IO 작업은 suspend + Dispatchers.IO
suspend fun fetchData(): Result<Data> = withContext(Dispatchers.IO) {
    runCatching { api.getData() }
}

// ✅ ViewModel에서 launch
fun loadData() {
    viewModelScope.launch {
        _uiState.update { it.copy(isLoading = true) }
        fetchData()
            .onSuccess { data -> _uiState.update { it.copy(data = data, isLoading = false) } }
            .onFailure { e -> _uiState.update { it.copy(error = e.message, isLoading = false) } }
    }
}

// ❌ 피함 — GlobalScope
GlobalScope.launch { ... }

// ❌ 피함 — runBlocking (테스트 제외)
runBlocking { ... }
```

---

## Flow

```kotlin
// ✅ Repository에서 Flow 반환
fun observeItems(): Flow<List<Item>> = dao.observeAll().map { it.map(ItemEntity::toDomain) }

// ✅ ViewModel에서 stateIn 변환 (캐싱)
val items: StateFlow<List<Item>> = repository.observeItems()
    .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

// ✅ flowOn으로 스레드 지정
fun heavyFlow(): Flow<Result> = flow { ... }.flowOn(Dispatchers.IO)
```

---

## 확장 함수 (Extension Functions)

```kotlin
// ✅ 유틸성 변환에 활용
fun Long.toFormattedDate(): String = SimpleDateFormat("yyyy-MM-dd").format(Date(this))
fun String.toSafeInt(default: Int = 0) = toIntOrNull() ?: default

// ✅ Entity ↔ Domain 매핑
fun UserEntity.toDomain() = User(id = id, name = name)
fun User.toEntity() = UserEntity(id = id, name = name)

// ❌ 피함 — 도메인 전혀 무관한 로직을 확장 함수로 (오용)
```

---

## 에러 처리

```kotlin
// ✅ runCatching — Result<T> 반환
suspend fun getUser(id: Long): Result<User> = runCatching {
    dao.findById(id)?.toDomain() ?: throw NoSuchElementException("User $id not found")
}

// ✅ Result 체이닝
result
    .map { user -> user.copy(name = user.name.trim()) }
    .onSuccess { user -> updateUi(user) }
    .onFailure { e -> log(e) }

// ❌ 피함 — 빈 catch 블록
try { ... } catch (e: Exception) { /* 무시 */ }
```

---

## Hilt 의존성 주입

```kotlin
// ✅ 생성자 주입 (권장)
@HiltViewModel
class HomeViewModel @Inject constructor(
    private val getItemsUseCase: GetItemsUseCase
) : ViewModel()

// ✅ Hilt Module
@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {
    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): AppDatabase =
        Room.databaseBuilder(context, AppDatabase::class.java, "app.db").build()
}
```
