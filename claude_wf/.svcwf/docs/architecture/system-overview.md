# System Overview

> 프로젝트 세팅 후 이 파일을 채워주세요. AI가 시스템 구조를 이해하는 데 사용합니다.

---

## 아키텍처 개요

<!-- 예: MVVM + Clean Architecture, 레이어 구조 설명 -->

```text
Presentation (UI / ViewModel)
        ↕
Domain (UseCase / Repository Interface / Model)
        ↕
Data (Repository Impl / Room / Retrofit / DataStore)
```

---

## 주요 화면 목록

| 화면명 | 클래스/파일 | 설명 |
| ---- | ---- | ---- |
| | | |

---

## 데이터 레이어

### 로컬 DB (Room)

| Entity | DAO | 설명 |
| ---- | ---- | ---- |
| | | |

### 원격 API (Retrofit / 필요 시)

| Endpoint | 설명 |
| ---- | ---- |
| | |

### 로컬 저장소 (DataStore / SharedPreferences)

| Key / Proto | 설명 |
| ---- | ---- |
| | |

---

## 의존성 주입 (Hilt)

| 모듈 파일 | 제공하는 의존성 |
| ---- | ---- |
| | |

---

## 외부 SDK / 라이브러리 (주요)

| 라이브러리 | 용도 |
| ---- | ---- |
| Jetpack Compose | UI |
| Hilt | 의존성 주입 |
| Room | 로컬 DB |
| Coroutines + Flow | 비동기 처리 |
| | |

---

## 주요 권한 (AndroidManifest)

| 권한 | 사유 |
| ---- | ---- |
| | |
