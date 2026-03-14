# Product Requirements Document (PRD) - FocusTimer App
**버전:** v1.1 (MVP 런칭 및 Android Play Store 출시 준비 단계)
**목표:** 매주 1개 앱 출시 프로젝트의 첫 번째 타겟. 안드로이드 마켓의 성공적인 안착, 초기 리텐션 확보 및 수익화 구조 검증.

## 1. 프로젝트 개요 (Overview)
* **제품명:** FocusTimer (가칭)
* **타겟 고객:** 스마트폰 의존도를 줄이고 집중력이 필요한 수험생, 대학생, 직장인
* **핵심 가치:** 직관적인 타이머, 시각화된 통계 성취감, 그리고 간편한 공유를 통한 바이럴 확산

## 2. 현재 구현 상태 (As-Is: MVP 코어 개발 완료)
* **UI/UX & 상태 관리:** React + Zustand를 활용한 타이머 모드(집중 25분/휴식 5분), 목표 설정, 네비게이션 구현 완료.
* **통계 (Statistics):** Chart.js 기반 주간/월간 데이터 시각화 및 LocalStorage 기반 로컬 데이터 유지 기능 확보.
* **하이브리드 앱 기반:** Capacitor 세팅(`capacitor.config.ts`)이 되어 있어 모바일 빌드 준비 완료.

## 3. 업데이트 요구사항 (To-Be: Android 마켓 출시 및 리텐션 강화)
앱스토어 출시에 필요한 **네이티브 경험(Native Experience)**과 **정책 준수** 요소를 보강합니다.

### 3.1. 네이티브 기능 및 Android 최적화 (Architect / Network)
* **백그라운드 생존성 보장:** 모바일 OS(Android)의 특성상 앱이 백그라운드로 전환되면 `setInterval` 로직이 중단됩니다. 앱 진입/진출 시 타임스탬프를 비교하여 시간을 강제 보정하거나, 백그라운드 태스크 처리가 필수입니다.
* **Android 권한(Permissions) 및 매니페스트 설정:** 인터넷 권한(광고용), 알림 권한(포모도로 종료 알림)을 `AndroidManifest.xml`에 명시해야 합니다.
* **Haptic & Sound Feedback:** 집중 종료, 휴식 시작 시 사용자가 화면을 보지 않아도 알 수 있도록 진동과 알림음을 제공합니다.

### 3.2. 수익화 및 바이럴 (CEO / CSO)
* **AdMob 네이티브 연동:** 현재 UI Placeholder 상태인 `BannerAd`와 `InterstitialAd`를 `@capacitor-community/admob` SDK를 활용하여 실제 광고로 대체해야 합니다. 
* **바이럴 공유 (Viral Loop):** '통계 스크린'의 오늘의 성과를 캡처하여 네이티브 공유 시트(Share Sheet)를 통해 인스타그램 등에 공유하는 기능을 추가합니다.

### 3.3. Android 마켓 배포 요구사항
* **스플래시 스크린 & 아이콘:** 스토어 규격에 맞는 고해상도 앱 아이콘 및 구동 스플래시 화면을 렌더링해야 합니다.
* **빌드 및 릴리즈:** Android Keystore 생성 및 릴리즈용 `.aab` (Android App Bundle) 파일 추출 파이프라인.