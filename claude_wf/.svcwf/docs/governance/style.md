# Style Guide — Kotlin / Android

> 코드 포맷·스타일 규칙입니다. ktlint 설정과 연동하여 유지합니다.

---

## 공통

| 항목 | 규칙 |
| ---- | ---- |
| 들여쓰기 | 스페이스 4칸 |
| 최대 줄 길이 | 120자 |
| 줄 끝 | LF |
| 파일 끝 | 빈 줄 1개 |
| 인코딩 | UTF-8 |

---

## 주석

```kotlin
// ── 섹션 구분 ──────────────────────────────────────────────
// 단일 줄 주석: 코드 위에 작성 (코드 오른쪽 인라인 금지)

/**
 * KDoc: public 클래스·함수에 필수 작성
 * @param userId 조회할 사용자 ID
 * @return 사용자 도메인 모델, 없으면 null
 */

// TODO: 후속 작업 필요
// FIXME: 알려진 버그/임시 우회
// NOTE: 중요 맥락 설명
```

---

## Import 순서

```text
1. kotlin.* / kotlinx.*
2. android.* / androidx.*
3. com.google.* / 기타 외부 라이브러리
4. 프로젝트 내부 패키지
--- 각 그룹 사이 빈 줄 ---
```

ktlint가 자동 정렬을 처리합니다.

---

## 클래스 내부 순서

```text
1. companion object (상수, Factory)
2. 의존성 주입 필드 (@Inject val ...)
3. 상태 필드 (private val _uiState ...)
4. 공개 프로퍼티 (val uiState ...)
5. init 블록
6. public 함수
7. private 함수
```

---

## Kotlin 관용 표현

```kotlin
// ✅ 좋음 — 안전 호출
val name = user?.name ?: "Unknown"

// ❌ 피함 — 강제 언랩
val name = user!!.name

// ✅ 좋음 — apply / also / let / with 적절히 사용
val intent = Intent(context, DetailActivity::class.java).apply {
    putExtra("id", userId)
}

// ✅ 좋음 — 단일 식 함수 (짧은 경우)
fun isValid(name: String) = name.isNotBlank()

// ✅ 좋음 — data class copy()
val updated = state.copy(isLoading = false)
```

---

## Compose 스타일

```kotlin
// Screen Composable: 상태 수집은 Screen 레벨에서
@Composable
fun HomeScreen(viewModel: HomeViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    HomeContent(uiState = uiState, onAction = viewModel::onAction)
}

// Content Composable: Stateless — 상태와 콜백을 파라미터로
@Composable
fun HomeContent(
    uiState: HomeUiState,
    onAction: (HomeAction) -> Unit,
    modifier: Modifier = Modifier  // modifier는 마지막 직전 파라미터
) { ... }

// Preview는 Stateless Composable에 작성
@Preview(showBackground = true)
@Composable
private fun HomeContentPreview() {
    HomeContent(uiState = HomeUiState(), onAction = {})
}
```

---

## 린트 / 포맷터

| 도구 | 설정 파일 | 명령 |
| ---- | ---- | ---- |
| ktlint | `.editorconfig` 또는 `build.gradle.kts` | `./gradlew ktlintCheck` / `./gradlew ktlintFormat` |
| detekt | `detekt.yml` | `./gradlew detekt` |
| Android Lint | `lint.xml` | `./gradlew lint` |

> 린트 규칙이 이 문서와 충돌하면 **린트 설정이 우선**합니다.
