# Java 함수 거버넌스

> Java 메서드·클래스 작성 규칙입니다.
> 공통 스타일은 `../style.md`, 네이밍은 `../naming.md`를 참고하세요.

---

## 메서드 선언 규칙

| 항목 | 규칙 | 예시 |
| ---- | ---- | ---- |
| 메서드명 | `camelCase`, 동사 시작 | `getUserById()`, `calculateTotal()` |
| 접근 제어자 순서 | `public/protected/private` + `static` + `final` | `public static final` |
| 반환 타입 | 명시적 선언 필수 | `List<User>`, `Optional<Order>` |
| 파라미터 | 3개 이하 (초과 시 DTO/Builder 사용) | |

---

## 메서드 크기 / 복잡도

| 항목 | 기준 |
| ---- | ---- |
| 최대 줄 수 | 30줄 이하 권장 |
| 최대 파라미터 수 | 3개 이하 |
| 순환 복잡도 | 10 이하 |
| 중첩 depth | 3단계 이하 |

---

## 생성자 / Builder

```java
// ❌ 파라미터 과다 생성자
public User(String name, String email, int age, String role) { ... }

// ✅ Builder 패턴
User user = User.builder()
    .name("홍길동")
    .email("hong@example.com")
    .role(UserRole.ADMIN)
    .build();
```

---

## 예외 처리

```java
// ✅ 커스텀 예외 클래스 사용
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String userId) {
        super("User not found: " + userId);
    }
}

// ✅ 체크 예외는 최소화 (비즈니스 예외는 Unchecked 권장)
// ✅ catch 후 반드시 처리 (빈 catch 블록 금지)
try {
    return userRepository.findById(id)
        .orElseThrow(() -> new UserNotFoundException(id));
} catch (DataAccessException e) {
    log.error("DB 조회 실패: userId={}", id, e);
    throw new ServiceException("사용자 조회 중 오류 발생", e);
}
```

---

## Null 처리

```java
// ✅ Optional 사용 (반환값이 없을 수 있는 경우)
public Optional<User> findById(String id) { ... }

// ❌ null 직접 반환 금지 (컬렉션은 빈 컬렉션 반환)
public List<User> findAll() {
    return Collections.emptyList(); // null 대신
}

// ✅ @NonNull / @Nullable 어노테이션으로 의도 명시
public User update(@NonNull String id, @Nullable String email) { ... }
```

---

## 어노테이션 순서 (Spring 기준)

```java
@RestController         // 1. 역할 어노테이션
@RequestMapping("/api") // 2. 매핑
@Validated              // 3. 검증
@Slf4j                  // 4. 유틸 어노테이션
public class UserController { ... }
```

---

## 로깅

```java
// ✅ Slf4j 사용, @Slf4j 어노테이션 권장
log.info("사용자 조회: userId={}", userId);
log.error("조회 실패: userId={}", userId, exception); // 예외는 마지막 파라미터

// ❌ System.out.println 사용 금지
System.out.println("user: " + user);
```

---

## 불변성 (Immutability)

- 가능한 경우 `final` 필드 사용
- setter보다 생성자/Builder 선호
- 컬렉션은 반환 시 `Collections.unmodifiableList()` 또는 `List.copyOf()` 사용

---

## 참고

- `../naming.md` — 클래스·메서드·변수 네이밍 규칙
- `../style.md` — 코드 포맷·주석 규칙
- `../patterns.md` — 아키텍처·디자인 패턴
