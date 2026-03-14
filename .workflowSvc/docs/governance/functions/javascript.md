# JavaScript / TypeScript 함수 거버넌스

> JS/TS 함수·메서드 작성 규칙입니다.
> 공통 스타일은 `../style.md`, 네이밍은 `../naming.md`를 참고하세요.

---

## 함수 선언 방식

| 상황 | 권장 방식 | 예시 |
| ---- | ---- | ---- |
| 모듈 최상위 함수 | `function` 선언 | `function getUserById(id)` |
| 콜백 / 인라인 | Arrow function | `arr.map(x => x * 2)` |
| 클래스 메서드 | 메서드 단축 표기 | `class Foo { bar() {} }` |
| 이벤트 핸들러 | Arrow function (this 바인딩 방지) | `onClick={e => handleClick(e)}` |

---

## 비동기 함수

```typescript
// ✅ 권장: async/await + 명시적 에러 처리
async function fetchUser(id: string): Promise<User> {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data;
  } catch (error) {
    throw new UserNotFoundError(`User ${id} not found`, { cause: error });
  }
}

// ❌ 금지: 콜백 중첩 (Callback Hell)
getUser(id, function(err, user) {
  getOrders(user.id, function(err, orders) { ... });
});
```

---

## 함수 크기 / 복잡도

| 항목 | 기준 |
| ---- | ---- |
| 최대 줄 수 | 50줄 이하 권장 |
| 최대 파라미터 수 | 3개 이하 (초과 시 객체로 묶기) |
| 순환 복잡도 | 10 이하 |
| 중첩 depth | 3단계 이하 |

```typescript
// ❌ 파라미터 과다
function createUser(name, email, age, role, department) {}

// ✅ 객체로 묶기
function createUser({ name, email, age, role, department }: CreateUserDto) {}
```

---

## 타입 (TypeScript)

```typescript
// ✅ 명시적 반환 타입 (공개 함수)
function calculateTotal(items: Item[]): number { ... }

// ✅ 제네릭 타입 파라미터는 의미 있는 이름 사용
function findById<TEntity>(id: string): TEntity | null { ... }

// ❌ any 사용 금지 (불가피한 경우 주석 필수)
function process(data: any) { ... } // FIXME: any 제거 예정
```

---

## 에러 처리

```typescript
// ✅ 커스텀 에러 클래스
class UserNotFoundError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'UserNotFoundError';
  }
}

// ✅ 에러 타입 명시
function parse(input: string): Result<Data, ParseError> { ... }
```

---

## 순수 함수 / 부수 효과

- 비즈니스 로직 함수는 **순수 함수** 지향 (같은 입력 → 같은 출력)
- 부수 효과(I/O, 상태 변경)는 경계 계층에서만 허용
- 순수 함수는 단위 테스트 작성 필수

---

## 참고

- `../naming.md` — 함수·변수 네이밍 규칙
- `../style.md` — 포맷·주석 규칙
- `../patterns.md` — 사용 디자인 패턴
