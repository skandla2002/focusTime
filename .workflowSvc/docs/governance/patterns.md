# Patterns

> 프로젝트에서 사용하는 아키텍처·디자인 패턴과 금지 패턴을 정의합니다.
> 패턴 도입·변경 시 `.workflowSvc/docs/decisions/` ADR에 근거를 남깁니다.

---

## 아키텍처 패턴

<!-- 프로젝트에서 채택한 아키텍처 패턴을 기술하세요 -->

| 패턴 | 적용 영역 | 비고 |
| ---- | ---- | ---- |
| (예) Layered Architecture | 전체 구조 | Controller → Service → Repository |
| (예) CQRS | 읽기/쓰기 분리 | 복잡한 쿼리에 한해 적용 |

---

## 디자인 패턴

<!-- 반복적으로 사용하는 GoF 등 디자인 패턴 목록 -->

| 패턴 | 사용 위치 | 목적 |
| ---- | ---- | ---- |
| (예) Repository | `*/repository/*.ts` | DB 접근 추상화 |
| (예) Factory | `*/factory/*.ts` | 객체 생성 로직 분리 |
| (예) Observer | 이벤트 처리 | 느슨한 결합 유지 |

---

## 모듈 / 파일 구조 패턴

```text
(예) Feature-based 구조:
src/
├── user/
│   ├── user.controller.ts
│   ├── user.service.ts
│   ├── user.repository.ts
│   └── user.types.ts
└── order/
    ├── order.controller.ts
    └── ...
```

<!-- 프로젝트 구조 패턴으로 교체하세요 -->

---

## Anti-pattern (금지 패턴)

| 패턴 | 이유 | 대안 |
| ---- | ---- | ---- |
| God Object | 단일 책임 원칙 위반 | 역할 분리 |
| Magic Number | 가독성·유지보수 저하 | 상수(UPPER_SNAKE_CASE)로 추출 |
| Callback Hell | 가독성·오류 처리 어려움 | async/await 또는 Promise 체이닝 |

---

## 에러 처리 패턴

<!-- 일관된 에러 처리 방식을 기술하세요 -->

```text
(예) 계층별 처리:
- Controller : HTTP 상태 코드로 변환, 로깅
- Service    : 비즈니스 예외 throw (커스텀 Error 클래스)
- Repository : DB 예외 wrapping 후 상위 전달
```

---

## 참고

- `naming.md` — 네이밍 규칙
- `style.md` — 코드 스타일
- `functions/` — 언어별 함수 패턴
