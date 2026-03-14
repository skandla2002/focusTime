# PRD --- Focus Study Timer App

**Version:** 0.1\
**Type:** MVP\
**Platform:** Android / iOS (PWA + Capacitor)\
**Monetization:** Ads (AdMob)

------------------------------------------------------------------------

# 1. Product Overview

## Product Name (Working)

FocusTimer / StudyFlow / 집중타이머

## Product Goal

사용자가 **집중 공부 시간을 기록하고 관리할 수 있는 타이머 앱**을
제공한다.

핵심 목적 - 집중 공부 시간 측정 - 공부 습관 형성 - 통계 제공

비즈니스 목적 - 광고 기반 수익 - 사용자 확보 후 AI 기능 확장

------------------------------------------------------------------------

# 2. Target Users

### Primary

학생 (중학생 \~ 대학생)

### Secondary

-   자격증 공부 사용자
-   직장인 자기개발 사용자

### User Pain Points

  문제                    설명
  ----------------------- ----------------------------
  집중 유지 어려움        공부 시작 후 집중이 깨짐
  공부 시간 관리 어려움   실제 공부 시간 파악 어려움
  동기 부족               목표 설정 및 기록 부족

------------------------------------------------------------------------

# 3. Core Value Proposition

앱은 다음 가치를 제공한다.

1.  간단한 집중 타이머\
2.  공부 시간 기록\
3.  시각적 통계 제공\
4.  목표 기반 동기 제공

------------------------------------------------------------------------

# 4. Core Features (MVP)

## 4.1 Focus Timer

Pomodoro 방식 타이머 (기본 25분 집중 / 5분 휴식)

사용 흐름

    타이머 시작
    ↓
    집중 시간 진행
    ↓
    완료 알림
    ↓
    기록 저장

데이터 구조

    focusSession {
     id
     startTime
     endTime
     duration
     date
    }

기능

-   Start / Pause / Reset
-   타이머 진행 UI
-   알림

------------------------------------------------------------------------

## 4.2 Study Time Record

사용자가 공부 시간을 기록한다.

화면

    오늘 공부시간
    주간 공부시간
    월간 공부시간

데이터 구조

    studyRecord {
     id
     date
     totalMinutes
     sessions[]
    }

------------------------------------------------------------------------

## 4.3 Statistics Dashboard

그래프 제공

기능

-   오늘 공부시간
-   주간 그래프
-   월간 그래프

그래프 유형

-   Bar Chart
-   Line Chart

------------------------------------------------------------------------

## 4.4 Study Goal

사용자는 목표 공부 시간을 설정한다.

예

    하루 목표: 2시간

데이터

    studyGoal {
     dailyGoalMinutes
    }

------------------------------------------------------------------------

# 5. Ad Monetization

## Ad Network

Google AdMob

## Ad Placement

### Banner Ad

홈 화면 하단

### Interstitial Ad

노출 시점 - 타이머 완료 후 - 통계 화면 이동 시

### Rewarded Ad (Optional)

예: 광고 시청 후 추가 통계 기능 잠금 해제

------------------------------------------------------------------------

# 6. Screens

## Home Screen

-   오늘 공부시간
-   타이머
-   Start 버튼
-   오늘 목표

## Timer Screen

-   타이머 표시
-   Pause
-   Stop

## Statistics Screen

-   주간 그래프
-   월간 그래프
-   총 공부시간

## Goal Setting Screen

-   목표 시간 설정

------------------------------------------------------------------------

# 7. UX Flow

    앱 실행
    ↓
    홈 화면
    ↓
    타이머 시작
    ↓
    집중
    ↓
    완료
    ↓
    기록 저장
    ↓
    광고 노출

------------------------------------------------------------------------

# 8. Data Storage

초기 MVP - Local Storage / SQLite

데이터

    focusSession
    studyRecord
    studyGoal

향후 - Cloud Sync

------------------------------------------------------------------------

# 9. Technical Stack

Frontend

    React
    TypeScript
    Vite
    Zustand
    Tailwind 또는 CSS

Mobile

    Capacitor

Charts

    Chart.js

Ads

    AdMob SDK

Storage

    SQLite / localStorage

------------------------------------------------------------------------

# 10. Future AI Features

사용자 확보 후 추가

### AI Study Coach

-   공부 패턴 분석
-   추천 공부 시간
-   시험 대비 계획

### AI Weakness Analysis

-   집중 시간 분석
-   개인 맞춤 공부 루틴

### AI Study Plan

-   시험 일정 기반 공부 계획 생성

------------------------------------------------------------------------

# 11. Success Metrics

  지표                 목표
  -------------------- ----------
  Daily Active Users   500+
  Session per day      3
  Retention Day7       25%
  Ad Revenue           \$3+ CPM

------------------------------------------------------------------------

# 12. MVP Scope

포함 기능

    Timer
    Study Record
    Statistics
    Goal
    Ads

제외

    로그인
    클라우드
    AI 기능

------------------------------------------------------------------------

# 13. Development Timeline

Week 1 - UI - Timer 기능

Week 2 - 기록 - 통계

Week 3 - 광고 - 앱 패키징

------------------------------------------------------------------------

# 14. Risks

  위험             대응
  ---------------- -------------
  광고 수익 낮음   사용자 증가
  사용자 이탈      UX 단순화
  경쟁 앱          차별 기능

------------------------------------------------------------------------

# 15. MVP Definition of Done

다음 조건 충족 시 MVP 완료

    타이머 작동
    기록 저장
    통계 표시
    목표 설정
    광고 표시
    모바일 실행
