# Project Structure

> 세션 시작 시 아래 명령으로 재생성하세요:
> ```bash
> find app/src/main/java -type f -name "*.kt" | sort > .workflowSvc/docs/architecture/structure.md
> ```
> 또는 직접 편집하여 현재 구조를 반영하세요.

---

## 표준 Android 프로젝트 구조 (참고용)

```text
<AppName>/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/<package>/
│   │   │   │   ├── data/
│   │   │   │   │   ├── local/         # Room DB, DAO, Entity
│   │   │   │   │   ├── remote/        # Retrofit API, DTO
│   │   │   │   │   └── repository/    # Repository 구현체
│   │   │   │   ├── domain/
│   │   │   │   │   ├── model/         # Domain 모델
│   │   │   │   │   ├── repository/    # Repository 인터페이스
│   │   │   │   │   └── usecase/       # UseCase
│   │   │   │   ├── presentation/
│   │   │   │   │   ├── ui/            # Compose Screen / Fragment
│   │   │   │   │   └── viewmodel/     # ViewModel
│   │   │   │   ├── di/                # Hilt 모듈
│   │   │   │   └── MainActivity.kt
│   │   │   ├── res/
│   │   │   │   ├── drawable/
│   │   │   │   ├── layout/            # XML 레이아웃 (View 방식)
│   │   │   │   └── values/            # strings, colors, themes
│   │   │   └── AndroidManifest.xml
│   │   ├── test/java/<package>/       # 단위 테스트
│   │   └── androidTest/java/<package>/ # Instrumented 테스트
│   └── build.gradle.kts
├── build.gradle.kts
├── gradle/
│   └── libs.versions.toml             # Version Catalog
└── settings.gradle.kts
```

---

## 실제 구조

<!-- 위 명령 실행 결과 또는 직접 작성한 실제 파일 트리를 여기에 붙여넣으세요 -->
