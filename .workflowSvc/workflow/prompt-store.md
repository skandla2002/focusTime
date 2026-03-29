# Prompt Store

> **용도**: brief.md 입력 내용이 plan.md 이슈로 상세화·규칙화된 시점에 원문 prompt를 보관한다.
> AI가 plan.md 이슈 상세를 작성하면서 요구사항을 구체적 조건·제약으로 정제할 때 반드시 이 파일에도 저장한다.

---

## 저장 형식

```markdown
### [YYYY-MM-DD] ISSUE-NNN: 제목

#### 원문 (brief.md 입력)
> 사용자가 작성한 원문 그대로

#### 상세화된 규칙 / 조건
- 조건 1
- 조건 2
- ...

**관련 이슈**: ISSUE-NNN
```

---

## 저장 내역

<!-- AI가 이슈를 상세화할 때마다 아래에 항목을 추가한다 -->

### [2026-03-29] ISSUE-046~054: UX 버그 수정 및 기능 개선

#### 원문 (brief.md 입력)

> - 집중시간 끝난 다음 광고가 나오고 광고 끝난 다음 휴식 시간일때 '집중 시간이 끝났어요'라는 문구가 뜨고 사용자가 화면 동작할수가 없는 문제 발생하였음, '집중 시간이 끝났어요'라는 문구가 있을때 다른 버튼을 누르면 해당 문구 Layer가 닫히도록 수정해줘.
> - 통계를 누를때 광고가 나오는 것은 클릭후 한시간동안은 계속 볼 수 있게 해줘.(한시간 지나서 '통계' 누를때 다시 광고 나오도록 설정)
> - 하단 배너 광고(BannerAd)는 계속 유지하도록 해줘. 이때 밑의 Navigation 영역은 배너광고 높이 위에 있어서 항상 보이도록 화면 수정해줘.
> - 타이머 '잠금' / '잠금 해제'가 한글보다는 열쇠 아이콘으로 바꿔줘
> - 타이머 '잠금' 클릭한 상태에서 다른 버튼이 다 안눌리는데, '시작', '계속' 버튼은 눌리게 해줘
> - 집중중에 휴식 탭을 눌렀다가 다시 집중탭을 누르면 시간이 초기화되는데, 이부분 수정해줘.(집중중에 휴식탭 이동시 집중 시간 중지되고, 다시 집중 시간으로 이동시 집중 시간 동작)
> - '공유하기' 기능에 스크린샷 공유하기도 포함하기
> - '통계'에 메모에 대한 정리된 통계도 추가 하기(많이 사용된 단어나, 시간대별 작업 분포 등)
> - 메모 입력시 자주 사용한 내용(최근 + 자주 + 입력중인 내용검색) 포함해서 선택할수 있는 DropdownList도 보이고, 클릭하면 바로 입력 되는 기능 추가

#### 상세화된 규칙 / 조건

- ISSUE-046: `completionOverlay` 클릭 시 `setCompletionNotice(null)` 호출로 즉시 닫기
- ISSUE-047: `appStore`에 `lastStatisticsAdAt` 추가 + `triggerStatisticsAd()` 1시간 쿨다운 체크
- ISSUE-048: `BannerAd.module.css`의 `bottom: var(--nav-height)` → `bottom: 0` (배너 최하단 고정)
- ISSUE-049: 잠금 버튼 텍스트 `t('timer.lock')` → `🔒`/`🔓` 이모지, aria-label은 번역 키 유지
- ISSUE-050: `isPrimaryActionLocked` 변수 제거 — 시작/계속 버튼 잠금 예외, 모드탭·GNB만 차단
- ISSUE-051: `timerStore.switchMode`에 `savedModeState` 도입 — 탭 전환 시 잔여 시간 보존
- ISSUE-052: `shareScreenshot()` 추가 (html2canvas → File → Web Share API Level 2 / 다운로드 fallback)
- ISSUE-053: `memoStats.ts` 유틸 — 빈출 단어 Top 10, 시간대별 분포 → `StatisticsScreen` 섹션 추가
- ISSUE-054: `MemoDropdown` 컴포넌트 — textarea 포커스/입력 시 최근·자주·Fuse.js 검색 드롭다운

**관련 이슈**: ISSUE-046, ISSUE-047, ISSUE-048, ISSUE-049, ISSUE-050, ISSUE-051, ISSUE-052, ISSUE-053, ISSUE-054

### [2026-03-29] ISSUE-055~057: 집중 잠금 포커스 실드 + 흑백 모드

#### 원문 (brief.md 입력)
> - 집중모드에 '잠금'을 하게 되면 전체 화면을 어둡게 감싸는 레이어가 떠서 집중시에 사람의 시선에 방해가 되지 않았으면해. 이부분 더 좋은 방법이 있다면 추가로 정리해줘
> - 흑백 모드도 추가로 만들어줘. 흑백 모드는 생상이 전체 흑백 사진과 같이 보여서 눈의 피로가 적게 할수 있도록 하고, 상단 아이콘으로 클릭시 칼라모드/흑백모드 선택하는 것 추가해줘. 이때 흑백 모드의 경우 디자인 token 부터 우선 추가되는 작업해주고, 이후 디자인 스타일 개선되는 것까지 고려해서 만들어줘.

#### 상세화된 규칙 / 조건
- ISSUE-055: 전체 차단형 검은 레이어보다 비필수 UI를 어둡게 내리고 타이머 핵심 UI를 살리는 `포커스 실드` 방식으로 계획
- ISSUE-055: `focusLock && focus mode`에서만 노출하고, 시작/계속/잠금 등 핵심 제어는 계속 조작 가능해야 함
- ISSUE-056: 흑백 모드는 `filter: grayscale(1)`가 아니라 semantic design token 기반으로 설계
- ISSUE-056: `design-tokens.json`과 `generate-tokens.mjs`를 확장해 color / grayscale 모드 CSS 변수를 함께 생성
- ISSUE-056: 시각 모드 선택은 앱 상태와 localStorage에 저장되어 재진입 후에도 유지
- ISSUE-057: 상단 아이콘 토글로 color / grayscale 모드를 전환할 수 있어야 함
- ISSUE-057: Home/Login/Timer/Statistics/Goal/Memo 등 주요 화면이 흑백 모드에서 읽히도록 공용 스타일과 화면별 강조색을 semantic token으로 치환
- ISSUE-057: 차트·진행바·타이머 링도 명도 대비 중심으로 재설계해 흑백 모드에서 구분 가능해야 함

**관련 이슈**: ISSUE-055, ISSUE-056, ISSUE-057
