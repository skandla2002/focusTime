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
