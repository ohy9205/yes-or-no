# YES / NO — 결정 옵션 추가 플랜 (확률 기울이기 · 삼세번)

## Context

MVP(`plan.md` Phase 1~7)는 구현 완료 상태입니다. 이 문서는 `plan.md` 맨 아래 "범위 밖"에 적어둔 두 항목을 본 범위로 끌어올리는 후속 플랜입니다.

- **한쪽 확률 높이기** — 사용자가 YES 또는 NO 쪽으로 추첨을 살짝 기울일 수 있게 한다
- **세 번 연달아 뽑기(삼세번)** — 한 번이 아니라 3판 2선승으로 결론을 낸다

두 옵션은 서로 곱해집니다(기울인 상태로 삼세번 뽑기 가능). 지금 코드가 `decide()` 한 방 → 고정 1.3초 연출 → 결과 한 개를 전제로 짜여 있으므로, **추첨 결과가 "값 하나"에서 "판 목록"으로 바뀌는 것**이 이번 변경의 핵심입니다.

지켜야 할 기존 원칙:
- 화면 전환 없는 단일 화면, "10초 안에 쓰고 나가는" 경량 인터랙션
- 결과는 연출 시작 시점에 **전부 확정**해두고 연출만 재생 (백그라운드 전환에도 답이 안 바뀜)
- 단계 전환은 `setTimeout` 체인이 아니라 **시작 시각 기준 경과 시간** 계산
- 애니메이션은 CSS keyframes + `@emotion/react`만 사용, 라이브러리 추가 없음
- 서버·계정 없음, `permissions: []` 유지

---

## 설계 결정

### 1) 기울임은 3단 선택, 강도는 고정 65%

체크박스 하나로는 "어느 쪽으로 기우는지"를 표현할 수 없습니다. `SegmentedControl` 3단 — **`NO 쪽` / `반반` / `YES 쪽`** — 으로 두면 상태가 하나로 끝나고 기본값(`반반`)이 곧 기존 동작입니다.

강도는 **65%로 고정**합니다. 체감은 되지만 결과가 뻔해지지는 않는 선이고, 강도까지 노출하면 노브가 두 개로 늘어 "10초" 목표를 해칩니다. 값은 `TILT_RATE` 상수 한 곳에서만 바꿉니다.

### 2) 삼세번은 3판 2선승 + 2:0이면 조기 종료

"세 번 연달아"를 문자 그대로 3판 전부 보여주면, 2:0으로 이미 끝난 뒤 세 번째에 반대 답이 뜨는 경우가 생깁니다. 사용자에게는 **"NO가 나왔는데 왜 결론이 YES야?"** 로만 읽힙니다. 스포츠 3판 2선승과 동일하게 2승이 확정되면 거기서 멈춥니다. 즉 판 수는 항상 **2 또는 3**입니다.

### 3) 기울인 사실은 항상 표기한다

결과 화면·공유 카드·공유 문구에 `YES 쪽 확률 65%로 뽑았어요`를 함께 노출합니다. 확률을 숨기지 않는 것이 `plan.md` Phase 7의 "재미로 보는 결과예요"와 같은 방어선입니다(운세·사행성 오인 방지). 금전·베팅 요소는 여전히 없습니다.

### 4) 공유 계열 함수는 인자를 묶는다

`renderResultCard(question, answer)` → 판 목록과 기울임까지 넘기면 인자가 4개가 됩니다. `DecisionResult` 객체 하나로 묶어 전달합니다.

```ts
export interface DecisionResult {
  question: string;
  answer: Answer;   // 최종 결론
  draws: Answer[];  // 길이 1(단판) 또는 2~3(삼세번)
  tilt: Tilt;
}
```

---

## 변경/추가 파일

```
src/
├─ App.tsx                              # 옵션 상태 + start(options) 연결
├─ features/decision/
│  ├─ decide.ts                         # (수정) tilt 인자 추가
│  ├─ decide.test.ts                    # (수정) 기울임 분포 검증 추가
│  ├─ series.ts                         # (신규) 3판 2선승 추첨·집계
│  ├─ series.test.ts                    # (신규)
│  ├─ options.ts                        # (신규) DecisionOptions 타입·기본값·검증
│  ├─ timeline.ts                       # (신규) 판 수에 따른 연출 구간 계산
│  ├─ timeline.test.ts                  # (신규) usePhase.test.ts에서 이관
│  ├─ usePhase.ts                       # (수정) 라운드 개념 도입
│  └─ usePhase.test.ts                  # (삭제/이관) phaseAt → timeline.test.ts
├─ features/share/
│  ├─ renderResultCard.ts               # (수정) DecisionResult, tally·기울임 표기
│  ├─ renderResultCard.test.ts          # (수정)
│  ├─ saveResultImage.ts                # (수정) 시그니처
│  ├─ shareResult.ts                    # (수정) 시그니처, 메시지 본문
│  └─ shareResult.test.ts               # (수정)
├─ features/storage/
│  └─ options.ts                        # (신규) 옵션 저장·복원
├─ components/
│  ├─ DecisionOptions.tsx               # (신규) 기울임 세그먼트 + 삼세번 스위치
│  ├─ RoundTally.tsx                    # (신규) ●●○ 진행/집계 표시
│  ├─ RevealStage.tsx                   # (수정) 라운드 진행 표시
│  └─ ResultCard.tsx                    # (수정) tally + 기울임 문구
└─ styles/
   └─ stage.ts                          # (수정) tally 행 레이아웃
```

---

## 구현 단계

### 규칙 (`plan.md`와 동일)
- 커밋은 핵심만 간결하게 oneline으로
- 주석은 기능 설명만 한다. 예외처리가 아니고선 구체적인 맥락, 근거, 값을 담지 않는다

### Phase 1 — 추첨 로직 (UI 없이 먼저) ✅

`decide.ts` — 기존 무인자 호출의 동작은 그대로 두고 인자만 추가합니다. `%` 대신 `[0,1)` 실수 비교로 바꿔야 50:50 외의 비율을 표현할 수 있습니다.

```ts
export type Answer = 'YES' | 'NO';
/** null이면 기울이지 않음 */
export type Tilt = Answer | null;

export const TILT_RATE = 0.65;

export function decide(tilt: Tilt = null): Answer {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const roll = buf[0] / 2 ** 32;
  if (tilt === null) return roll < 0.5 ? 'YES' : 'NO';
  return roll < TILT_RATE ? tilt : opposite(tilt);
}
```

`series.ts` — 판 목록을 만들고 집계합니다. 승자 판정은 순수 함수로 분리해 테스트에서 임의의 판 목록을 넣어볼 수 있게 합니다.

```ts
export const WINS_NEEDED = 2;
export const MAX_ROUNDS = 3;

/** 2승이 확정되면 남은 판은 뽑지 않는다 */
export function drawSeries(tilt: Tilt): Answer[];
export function tally(draws: Answer[]): Record<Answer, number>;
export function winner(draws: Answer[]): Answer;
```

`options.ts` — 옵션 타입과 기본값, 저장소에서 읽은 값의 검증을 한곳에 둡니다.

```ts
export interface DecisionOptions { tilt: Tilt; bestOfThree: boolean; }
export const DEFAULT_OPTIONS: DecisionOptions = { tilt: null, bestOfThree: false };
export function normalizeOptions(raw: unknown): DecisionOptions;
```

**테스트** (`decide.test.ts`, `series.test.ts`)
- 무인자 `decide()`의 49~51% 검증은 **기존 테스트를 그대로 유지** (동작 불변의 안전망)
- `decide('YES')` 10만 회 → YES 비율 64~66%, `decide('NO')`도 대칭으로 성립
- `drawSeries`: 길이가 항상 2 또는 3, 2:0이면 길이 2, 첫 두 판이 갈리면 길이 3
- `winner`: 다수 답을 반환하고 어떤 판 목록에도 `null`을 반환하지 않는다
- `normalizeOptions`: 깨진 값·구버전 값이 들어와도 `DEFAULT_OPTIONS`로 수렴

### Phase 2 — 연출 타임라인 ✅

지금은 `PHASE_MS` 상수 두 개와 누적 경계 두 개로 끝나지만, 판 수가 2~3으로 늘면 경계가 판 수에 따라 달라집니다. **판 수를 받아 구간 배열을 만드는 순수 함수**로 바꿉니다.

`timeline.ts`
```ts
export type StagePhase = 'rolling' | 'teasing' | 'roundResult' | 'revealed';

export const SINGLE_MS = { rolling: 700, teasing: 600 };
export const SERIES_MS = { rolling: 420, teasing: 260, roundResult: 420 };

/** 판 수에 맞춰 누적 종료 시각이 담긴 구간 목록을 만든다 */
export function buildTimeline(rounds: number): Segment[];
/** 경과 시간에 해당하는 구간 */
export function frameAt(elapsed: number, timeline: Segment[]): { phase: StagePhase; round: number };
```

| 모드 | 구성 | 총 길이 |
|---|---|---|
| 단판 | rolling 700 + teasing 600 | 1,300ms (**기존과 동일**) |
| 삼세번 2판 | (420+260)×2 + roundResult 420 | 1,780ms |
| 삼세번 3판 | (420+260)×3 + roundResult 420×2 | 2,880ms |

- 마지막 판은 `roundResult` 구간 없이 곧장 `revealed`로 들어갑니다. 최종 결과가 라운드 배지로 한 번, 대형 타이포로 또 한 번 뜨는 중복을 없애기 위함입니다.
- 삼세번이 3초를 넘지 않게 잡았습니다. 사용자가 스스로 켠 의식(儀式)이라 단판보다 길어도 되지만, "10초 안에" 목표는 유지합니다.

`usePhase.ts` 수정
- `start(options: DecisionOptions)` — 진입 시점에 `drawSeries()`로 **판 목록 전체를 확정**하고 타임라인을 만든 뒤 재생만 합니다(결과 불변 원칙 유지).
- 반환값에 `round`(현재 판 인덱스)와 `draws`(지금까지 공개된 판)를 추가합니다. 공개된 판만 노출해야 연출 중에 결말이 새지 않습니다.
- `sync()`는 `frameAt`으로 현재 구간을 구하고 그 구간의 종료 시각까지 타이머를 잡습니다. `visibilitychange` 복귀 시 따라잡는 기존 로직은 그대로 동작합니다.
- 햅틱: 결정 버튼 `tickWeak`(기존) → 각 판 결과 공개 `tickMedium` → 최종 공개 `basicMedium`. 판마다 세기를 낮춰 최종 공개가 가장 크게 느껴지게 합니다. `success`/`error`는 계속 쓰지 않습니다.
- `prefers-reduced-motion`: 연출을 건너뛰고 판 목록 전체와 최종 결과를 즉시 표시합니다.

**테스트** (`timeline.test.ts` — 기존 `usePhase.test.ts`에서 이관)
- 단판 타임라인의 경계값이 기존과 동일하고 총 길이가 1,300ms를 넘지 않는다
- 3판 타임라인의 총 길이가 3,000ms 이하이고 구간이 단조 증가한다
- 크게 밀린 경과 시간(백그라운드 복귀)에 `revealed`에 머문다
- 각 구간 경계 직전/직후의 `{ phase, round }`가 기대대로 넘어간다

### Phase 3 — 옵션 UI ✅

`DecisionOptions.tsx` — idle 화면의 추천 칩 아래에 상시 노출합니다. 접이식으로 숨기면 기능 자체가 발견되지 않습니다.

- 기울임: `SegmentedControl` + `SegmentedControl.Item` 3개 (`NO 쪽` / `반반` / `YES 쪽`, `value`는 문자열이므로 `'none'`↔`null` 변환은 컴포넌트 안에서 처리)
- 삼세번: `ListRow` + 우측 `Switch`, 라벨 `한국인은 삼세번`, 보조 문구 `세 번 뽑아 2승이 이겨요`
- 기울임이 켜져 있으면 세그먼트 아래에 `YES가 나올 확률 65%`를 작게 표기 — 무엇이 바뀌는지 켜기 전에 알 수 있게 합니다

`App.tsx`
- `const [options, setOptions] = useState(DEFAULT_OPTIONS)`
- `handleDecide`에서 `start(options)` 호출
- 연출·결과 화면에서는 옵션 UI를 숨기고, `reset()` 후 idle로 돌아오면 선택은 유지합니다

### Phase 4 — 연출·결과 화면 반영 ✅

`RoundTally.tsx` — 연출과 결과가 공유하는 표시 컴포넌트. 판 하나를 점으로 그리고 공개된 판은 답변 색(`answerColor`)으로 채웁니다. 단판 모드에서는 렌더하지 않습니다.

- 진행 중: `● ● ○` — 최대 3칸을 미리 그려두고 채워 나갑니다(칸 수가 늘며 레이아웃이 튀지 않게)
- 최종: 점 아래 `YES 2 : 1 NO` 텍스트

`RevealStage.tsx`
- `roundResult` 구간을 추가로 렌더 — 방금 뽑힌 답을 중형 타이포로 짧게 보여줍니다
- 상단에 `RoundTally` 배치

`ResultCard.tsx`
- 최종 답 아래 `RoundTally`(집계 텍스트 포함)
- 기울임이 켜져 있었으면 `YES 쪽 확률 65%로 뽑았어요`를 안내 문구 위에 추가
- `재미로 보는 결과예요`는 그대로 유지

`stage.ts`
- tally 행 스타일을 추가하고, `RevealStage`의 숨김 placeholder와 같은 방식으로 결과 화면과 높이를 맞춰 전환 시 위치가 튀지 않게 합니다

### Phase 5 — 공유 · 카드 저장 ✅

`renderResultCard(result: DecisionResult)`
- 결과 대형 타이포 아래 `YES 2 : 1 NO` 한 줄 (단판이면 생략)
- 기울임 표기 한 줄을 하단 워터마크 위에 추가
- 캔버스 크기(1080×1080)·시스템 폰트 스택·`wrapText` 로직은 그대로 둡니다

`shareResult(result: DecisionResult)` — 메시지 본문
```
오늘 치킨 먹을까?

YES (삼세번 2:1)
YES 쪽 확률 65%

<toss link>
```
- 옵션이 모두 꺼져 있으면 기존 3줄 형태와 완전히 동일해야 합니다
- 딥링크 실패 시 링크만 빼고 공유를 이어가는 기존 처리 유지

`saveResultImage(result: DecisionResult)` — 시그니처만 변경, 파일명 규칙(`yesno-<timestamp>.png`)과 `try/catch` 정책은 유지

**테스트**
- `buildShareMessage`: 옵션 조합 4가지(반반/기울임 × 단판/삼세번)에 대한 본문, 링크 없는 경우 포함
- `renderResultCard`의 `wrapText` 기존 테스트는 그대로 통과해야 합니다

### Phase 6 — 옵션 저장·복원 ✅

`features/storage/options.ts` — `Storage.setItem('decision-options', JSON.stringify(options))`. 읽을 때는 `normalizeOptions`로 통과시켜 깨진 값이 화면을 깨뜨리지 않게 합니다. 저장·복원 실패 시 조용히 기본값으로 떨어지는 `recentQuestion.ts`와 동일한 정책입니다.

- 저장 시점: 옵션이 바뀔 때가 아니라 **결정 버튼을 누를 때** (마지막 질문 저장과 같은 시점, 저장소 쓰기 횟수 최소화)
- 복원 시점: 앱 진입 시 `loadRecentQuestion`과 함께 병렬로

### Phase 7 — 회귀 · 심사 점검 ✅

- `plan.md` 맨 아래 "범위 밖" 목록에서 이 두 항목을 제거하고 이 문서를 가리키게 정리
- 옵션 OFF 상태의 플로우가 변경 전과 **픽셀·타이밍·공유 문구까지 동일**한지 확인 (가장 중요한 회귀 기준)
- 확률을 기울여도 금전·베팅·확률 구매 요소가 없고, 기울인 비율이 화면에 항상 표기되는지 확인
- `permissions: []` 유지, 저장 항목은 질문 1개 + 옵션 1개뿐(기기 내 저장, 서버 전송 없음)
- `npm run build` 후 번들 증가분 확인 (신규 의존성 없음)

**점검 결과** (기준 커밋 `0a96711`)

| 항목 | 결과 |
|---|---|
| 연출 타이밍 | 단판 700/1,300ms 경계가 `phaseAt`과 동일 |
| 공유 문구 | OFF일 때 `[질문, 답, 링크]` 3단락으로 동일 |
| 카드 이미지 | OFF일 때 집계·기울임 줄을 건너뛰어 워터마크까지 동일 |
| 레이아웃 | `stageSlot` 도입으로 `...` → `???` 전환의 높이 튐이 사라짐 (유일한 픽셀 변화, 의도된 개선) |
| 심사 | `permissions: []`, `Storage` 키 2개(`recent-question`, `decision-options`), 서버 전송 없음 |
| 번들 | 1,214.36 → 1,219.19 kB (gzip 387.43 → 389.14 kB), 의존성 추가 없음 |

실기기 확인(햅틱 세기, 카드 저장, 재진입 복원)은 토스 테스트앱에서 별도로 진행합니다.

---

## 검증 방법

1. **단위 테스트** — `npm test`
   - 기존 `decide()` 50:50 테스트가 **수정 없이** 통과
   - 기울임 분포 64~66%, 시리즈 조기 종료, 타임라인 경계
2. **로컬 브라우저** — 옵션 조합 4가지를 모두 실행
   - 반반 + 단판 → 기존과 동일한 1.3초 연출
   - 반반 + 삼세번 → 판 배지가 순서대로 채워지고 2:0이면 2판에서 끝남
   - 기울임 + 단판 / 기울임 + 삼세번 → 결과 화면·카드·공유 문구에 65% 표기
   - 결과 → 다시 하기 → idle 복귀 시 옵션 선택 유지
3. **연출 회귀** — 삼세번 재생 도중 백그라운드 전환 후 복귀했을 때 판 목록과 최종 결과가 그대로인지 (판 수가 늘어 노출 구간이 길어진 만큼 재확인 필요)
4. **실기기(토스 테스트앱)**
   - 판마다 햅틱이 울리고 최종 공개가 가장 세게 느껴지는지
   - 저장된 카드 이미지에 집계와 기울임 문구가 들어가는지
   - 앱 재진입 시 마지막 질문과 옵션이 함께 복원되는지
5. **접근성** — `prefers-reduced-motion` 켠 상태에서 삼세번이 판 목록과 최종 결과를 즉시 보여주는지

---

## 확인이 필요한 사항

- **기울임 강도 65%** — 체감과 의외성의 균형으로 잡은 값입니다. 실기기에서 몇 번 돌려보고 밋밋하면 70%까지 올립니다. `TILT_RATE` 한 줄만 바꾸면 됩니다.
- **2:0 조기 종료** — 세 번째 판을 무조건 보여주는 쪽이 "삼세번"이라는 말에는 더 맞습니다. 다만 결론을 못 바꾸는 판에서 반대 답이 뜨는 혼란을 감수해야 하므로 조기 종료로 잡았습니다. 되돌린다면 `drawSeries`와 타임라인 판 수만 바꾸면 되고 나머지 층은 영향받지 않습니다.
- **옵션 UI 상시 노출** — 입력창 아래 공간을 차지하므로 실기기 화면에서 답답하면 `기울이기` 한 줄로 접는 형태를 검토합니다.

---

## 범위 밖 (계속 보류)

MAYBE 모드 / 결과별 코멘트 / 테마 변경 / 오늘의 질문 / 친구와 함께 결정하기 / 룰렛 연출 / 기울임 강도 슬라이더 / 결과 통계·히스토리.
