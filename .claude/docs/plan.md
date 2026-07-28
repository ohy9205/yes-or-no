# YES / NO — App in Toss 미니앱 구현 플랜

## Context

기획서만 존재하고 코드는 아직 없는 상태(그린필드)입니다. `C:\Users\User\Projects` 아래에 새 프로젝트를 만듭니다.

만들 것은 **질문 입력 → 랜덤 YES/NO → 연출 → 공유**로 끝나는 단일 화면 미니앱입니다. 서버·로그인·계정 없음. 목표는 "10초 안에 쓰고 나가는 초경량 인터랙션"이므로, 화면 전환 없이 한 화면에서 상태만 바뀌는 구조로 갑니다.

확정된 선택:
- **웹(Vite + React) 방식** — `@apps-in-toss/web-framework` + `@toss/tds-mobile`
- **공유 범위: 결과 카드 이미지 저장 + 텍스트 공유** — Canvas로 카드를 그려 `File.saveBase64`로 기기 저장, `Share.sendMessage`로 텍스트 공유

---

## 기술 스택 (공식 문서 확인 완료)

| 항목 | 내용 |
|---|---|
| 런타임 | 토스 WebView 미니앱 |
| 프레임워크 | Vite + React **18** (TDS가 react@^18 요구 — 19 쓰지 말 것) |
| 앱인토스 SDK | `@apps-in-toss/web-framework` |
| 디자인 시스템 | `@toss/tds-mobile`, `@toss/tds-mobile-ait`, `@emotion/react@^11` |
| 설정 파일 | `granite.config.ts` (`defineConfig` from `@apps-in-toss/web-framework/config`) |
| CLI | `npx ait init`, `npm run dev`, `npm run build` |
| 딥링크 | `intoss://{appName}` |

사용할 SDK API (전부 `@apps-in-toss/web-framework`):
- `Share.sendMessage({ message })` — 텍스트 공유 (이미지 미지원)
- `Share.createLink({ path, ogImageUrl? })` — `intoss://` 딥링크 생성
- `File.saveBase64({ data, fileName, mimeType })` — 기기에 이미지 저장 (`data:` 프리픽스 제거한 순수 base64)
- `Storage.getItem/setItem/removeItem/clearItems` — 비동기 로컬 저장소. **`AsyncStorage`는 화면 오류를 유발하므로 사용 금지**

---

## 프로젝트 구조

```
C:\Users\User\Projects\yes-or-no\
├─ granite.config.ts
├─ vite.config.ts
├─ index.html
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx                        # 단일 화면 + 상태머신 조립
│  ├─ features/decision/
│  │  ├─ decide.ts                   # 순수 랜덤 로직
│  │  ├─ decide.test.ts
│  │  ├─ suggestions.ts              # 추천 질문 데이터
│  │  └─ usePhase.ts                 # 연출 상태머신 훅
│  ├─ features/share/
│  │  ├─ renderResultCard.ts         # Canvas → base64 PNG
│  │  ├─ saveResultImage.ts          # File.saveBase64 래퍼
│  │  └─ shareResult.ts              # Share.createLink + sendMessage
│  ├─ features/storage/
│  │  └─ recentQuestion.ts           # Storage 래퍼 (마지막 질문 복원)
│  ├─ components/
│  │  ├─ QuestionInput.tsx
│  │  ├─ SuggestionChips.tsx
│  │  ├─ DecideButton.tsx
│  │  ├─ RevealStage.tsx             # ... → ??? → YES! 연출
│  │  └─ ResultCard.tsx
│  └─ styles/theme.ts
```

---

## 구현 단계

### Phase 0 — 콘솔 준비 (사용자 작업, 개발과 병렬 가능)
앱인토스 콘솔에서 워크스페이스/앱을 등록하고 **`appName`(고유 키)과 아이콘 이미지 URL**을 확정합니다. `appName`은 `granite.config.ts`와 콘솔 등록값이 반드시 일치해야 하고 딥링크에도 그대로 쓰입니다. 제안값: `yes-or-no`.
> 미확정이어도 Phase 1~5는 진행 가능합니다. 확정 전까지 `yes-or-no`를 임시로 넣고 Phase 6에서 교체합니다.

### Phase 1 — 스캐폴딩
1. `npm create vite@latest yes-or-no -- --template react-ts`
2. `npm i react@^18 react-dom@^18` 로 React 18 고정
3. `npm i @apps-in-toss/web-framework` → `npx ait init`
4. `npm i @toss/tds-mobile @toss/tds-mobile-ait @emotion/react@^11`
5. `granite.config.ts` 작성 — `appName`, `brand.displayName: 'YES / NO'`, `primaryColor`, `web.commands`, `permissions: []`(권한 요청 없음), `outdir: 'dist'`
6. `npm run dev`로 빈 화면 뜨는 것까지 확인

### Phase 2 — 도메인 로직 (UI 없이 먼저)
`decide.ts`: `crypto.getRandomValues`로 균등한 50:50 추첨. 연속 방지·확률 보정 **없음** (기획서의 50:50 원칙 그대로).
```ts
export type Answer = 'YES' | 'NO';
export function decide(): Answer {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % 2 === 0 ? 'YES' : 'NO';
}
```
`suggestions.ts`: 기획서 5-2)의 추천 질문 5개 + 여유분. 매 진입 시 셔플해 3~4개만 노출.
`decide.test.ts`: 10만 회 실행 시 YES 비율이 49~51% 안에 드는지, 반환값이 항상 두 값 중 하나인지 검증.

### Phase 3 — 화면 UI (연출 없이 정적으로)
단일 화면, 상단 질문 입력 → 추천 질문 칩 → 하단 고정 `결정하기` 버튼. TDS 컴포넌트를 기본으로 쓰되 결과 타이포는 직접 스타일링(YES/NO를 화면을 채우는 크기로).
입력이 비어 있으면 버튼 비활성 대신 **추천 질문 중 하나를 자동 선택**해 흐름이 막히지 않게 합니다.

### Phase 4 — 연출 상태머신
`usePhase.ts`가 관리할 5단계:

| phase | 화면 | 지속 |
|---|---|---|
| `idle` | 질문 입력 | — |
| `rolling` | `...` (점 3개 순차 점등) | 700ms |
| `teasing` | `???` (좌우 흔들림) | 600ms |
| `revealed` | `YES!` / `NO!` (스케일 스프링 + 색상 전환) | — |
| `idle`(재진입) | 다시 하기 / 공유 버튼 노출 | — |

- 총 대기 1.3초. "10초 안에" 목표를 해치지 않는 선.
- **결과는 `rolling` 진입 시점에 이미 확정**해 두고 연출만 재생합니다. 연출 도중 언마운트/백그라운드 전환에도 결과가 안 바뀝니다.
- 애니메이션은 CSS keyframes + `@emotion/react`만 사용 — 별도 애니메이션 라이브러리 추가하지 않습니다(번들 최소화).
- `prefers-reduced-motion` 대응: 연출 생략하고 즉시 결과 표시.

### Phase 5 — 공유 & 저장
`renderResultCard.ts`: 오프스크린 `<canvas>`(1080×1080)에 배경 + 질문 텍스트 + 큰 YES/NO + 하단 워터마크를 그려 `toDataURL('image/png')` 반환. 폰트는 시스템 폰트 스택 사용(웹폰트 로딩 실패로 카드가 깨지지 않게).

- **이미지 저장** — `data:image/png;base64,` 프리픽스를 잘라내고 `File.saveBase64({ data, fileName: 'yesno-<timestamp>.png', mimeType: 'image/png' })`
- **텍스트 공유** — `Share.createLink({ path: 'intoss://<appName>' })`로 링크를 받아 `Share.sendMessage`에 조합:
  ```
  오늘 치킨 먹을까?

  YES

  <toss link>
  ```
- 두 API 모두 구버전 토스 앱/권한 거부 시 실패할 수 있으므로 `try/catch`로 감싸고 실패 시 토스트만 띄우고 앱은 계속 동작하게 합니다.

### Phase 6 — 저장소
`Storage.setItem`으로 **마지막 질문 1개만** 저장해 재진입 시 입력창에 복원합니다. 기획서상 통계/히스토리는 MVP 제외이므로 그 이상 저장하지 않습니다. 모든 Storage 호출은 `await` (비동기 API).

### Phase 7 — 심사 대비 & 배포
- 결과 화면에 **"재미로 보는 결과예요"** 문구 고정 — 랜덤 결과 앱이 운세/사행성으로 오인되지 않게 하는 방어선. 금전·베팅·확률 구매 요소는 일절 없음.
- 개인정보 수집 없음(서버 없음, 질문은 기기에만 저장) — 심사 문의 대비해 명시할 수 있게 정리.
- `permissions: []` 유지 — 불필요한 권한 요청은 반려 사유가 됩니다.
- `npm run build` → 번들 용량 확인(**압축 해제 기준 100MB 이하**, 이 앱은 여유).
- 콘솔에서 **테스트 최소 1회 이상** 수행 후 '검토 요청하기'. **심사는 영업일 기준 최대 3일**. 승인 후 '출시하기'를 누르면 즉시 전체 사용자에게 반영됩니다.

---

## 검증 방법

1. **단위 테스트** — `npm test`로 `decide.test.ts` 통과 (분포 49~51%).
2. **로컬 브라우저** — `npm run dev` 후 모바일 뷰포트로 전체 플로우: 질문 입력 → 결정 → 연출 → 결과 → 다시 하기 → 공유.
3. **실기기(토스 테스트앱/샌드박스)** — SDK 호출은 브라우저에서 검증 불가하므로 반드시 실기기에서:
   - `File.saveBase64` 후 기기 갤러리에 카드 이미지가 실제로 생기는지
   - `Share.sendMessage`가 토스 공유 시트를 띄우는지
   - 앱 종료 후 재진입 시 마지막 질문이 복원되는지
   - `intoss://<appName>` 딥링크로 앱이 열리는지
4. **연출 회귀 확인** — 연출 중 뒤로가기/백그라운드 전환 후 복귀 시 결과가 바뀌지 않는지.

---

## 확인이 필요한 사항 (구현 중 문서로 검증)
# YES / NO — App in Toss 미니앱 구현 플랜

## Context

기획서만 존재하고 코드는 아직 없는 상태(그린필드)입니다. `C:\Users\User\Projects` 아래에 새 프로젝트를 만듭니다.

만들 것은 **질문 입력 → 랜덤 YES/NO → 연출 → 공유**로 끝나는 단일 화면 미니앱입니다. 서버·로그인·계정 없음. 목표는 "10초 안에 쓰고 나가는 초경량 인터랙션"이므로, 화면 전환 없이 한 화면에서 상태만 바뀌는 구조로 갑니다.

확정된 선택:
- **웹(Vite + React) 방식** — `@apps-in-toss/web-framework` + `@toss/tds-mobile`
- **공유 범위: 결과 카드 이미지 저장 + 텍스트 공유** — Canvas로 카드를 그려 `File.saveBase64`로 기기 저장, `Share.sendMessage`로 텍스트 공유

---

## 기술 스택 (공식 문서 확인 완료)

| 항목 | 내용 |
|---|---|
| 런타임 | 토스 WebView 미니앱 |
| 프레임워크 | Vite + React **18** (TDS가 react@^18 요구 — 19 쓰지 말 것) |
| 앱인토스 SDK | `@apps-in-toss/web-framework` |
| 디자인 시스템 | `@toss/tds-mobile`, `@toss/tds-mobile-ait`, `@emotion/react@^11` |
| 설정 파일 | `granite.config.ts` (`defineConfig` from `@apps-in-toss/web-framework/config`) |
| CLI | `npx ait init`, `npm run dev`, `npm run build` |
| 딥링크 | `intoss://{appName}` |

사용할 SDK API (전부 `@apps-in-toss/web-framework`):
- `Share.sendMessage({ message })` — 텍스트 공유 (이미지 미지원)
- `Share.createLink({ path, ogImageUrl? })` — `intoss://` 딥링크 생성
- `File.saveBase64({ data, fileName, mimeType })` — 기기에 이미지 저장 (`data:` 프리픽스 제거한 순수 base64)
- `Storage.getItem/setItem/removeItem/clearItems` — 비동기 로컬 저장소. **`AsyncStorage`는 화면 오류를 유발하므로 사용 금지**

---

## 프로젝트 구조

```
C:\Users\User\Projects\yes-or-no\
├─ granite.config.ts
├─ vite.config.ts
├─ index.html
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx                        # 단일 화면 + 상태머신 조립
│  ├─ features/decision/
│  │  ├─ decide.ts                   # 순수 랜덤 로직
│  │  ├─ decide.test.ts
│  │  ├─ suggestions.ts              # 추천 질문 데이터
│  │  └─ usePhase.ts                 # 연출 상태머신 훅
│  ├─ features/share/
│  │  ├─ renderResultCard.ts         # Canvas → base64 PNG
│  │  ├─ saveResultImage.ts          # File.saveBase64 래퍼
│  │  └─ shareResult.ts              # Share.createLink + sendMessage
│  ├─ features/storage/
│  │  └─ recentQuestion.ts           # Storage 래퍼 (마지막 질문 복원)
│  ├─ components/
│  │  ├─ QuestionInput.tsx
│  │  ├─ SuggestionChips.tsx
│  │  ├─ DecideButton.tsx
│  │  ├─ RevealStage.tsx             # ... → ??? → YES! 연출
│  │  └─ ResultCard.tsx
│  └─ styles/theme.ts
```

---

## 구현 단계

### Phase 0 — 콘솔 준비 (사용자 작업, 개발과 병렬 가능)
앱인토스 콘솔에서 워크스페이스/앱을 등록하고 **`appName`(고유 키)과 아이콘 이미지 URL**을 확정합니다. `appName`은 `granite.config.ts`와 콘솔 등록값이 반드시 일치해야 하고 딥링크에도 그대로 쓰입니다. 제안값: `yes-or-no`.
> 미확정이어도 Phase 1~5는 진행 가능합니다. 확정 전까지 `yes-or-no`를 임시로 넣고 Phase 6에서 교체합니다.

### Phase 1 — 스캐폴딩
1. `npm create vite@latest yes-or-no -- --template react-ts`
2. `npm i react@^18 react-dom@^18` 로 React 18 고정
3. `npm i @apps-in-toss/web-framework` → `npx ait init`
4. `npm i @toss/tds-mobile @toss/tds-mobile-ait @emotion/react@^11`
5. `granite.config.ts` 작성 — `appName`, `brand.displayName: 'YES / NO'`, `primaryColor`, `web.commands`, `permissions: []`(권한 요청 없음), `outdir: 'dist'`
6. `npm run dev`로 빈 화면 뜨는 것까지 확인

### Phase 2 — 도메인 로직 (UI 없이 먼저)
`decide.ts`: `crypto.getRandomValues`로 균등한 50:50 추첨. 연속 방지·확률 보정 **없음** (기획서의 50:50 원칙 그대로).
```ts
export type Answer = 'YES' | 'NO';
export function decide(): Answer {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % 2 === 0 ? 'YES' : 'NO';
}
```
`suggestions.ts`: 기획서 5-2)의 추천 질문 5개 + 여유분. 매 진입 시 셔플해 3~4개만 노출.
`decide.test.ts`: 10만 회 실행 시 YES 비율이 49~51% 안에 드는지, 반환값이 항상 두 값 중 하나인지 검증.

### Phase 3 — 화면 UI (연출 없이 정적으로)
단일 화면, 상단 질문 입력 → 추천 질문 칩 → 하단 고정 `결정하기` 버튼. TDS 컴포넌트를 기본으로 쓰되 결과 타이포는 직접 스타일링(YES/NO를 화면을 채우는 크기로).
입력이 비어 있으면 버튼 비활성 대신 **추천 질문 중 하나를 자동 선택**해 흐름이 막히지 않게 합니다.

### Phase 4 — 연출 상태머신
`usePhase.ts`가 관리할 5단계:

| phase | 화면 | 지속 |
|---|---|---|
| `idle` | 질문 입력 | — |
| `rolling` | `...` (점 3개 순차 점등) | 700ms |
| `teasing` | `???` (좌우 흔들림) | 600ms |
| `revealed` | `YES!` / `NO!` (스케일 스프링 + 색상 전환) | — |
| `idle`(재진입) | 다시 하기 / 공유 버튼 노출 | — |

- 총 대기 1.3초. "10초 안에" 목표를 해치지 않는 선.
- **결과는 `rolling` 진입 시점에 이미 확정**해 두고 연출만 재생합니다. 연출 도중 언마운트/백그라운드 전환에도 결과가 안 바뀝니다.
- 애니메이션은 CSS keyframes + `@emotion/react`만 사용 — 별도 애니메이션 라이브러리 추가하지 않습니다(번들 최소화).
- `prefers-reduced-motion` 대응: 연출 생략하고 즉시 결과 표시.

### Phase 5 — 공유 & 저장
`renderResultCard.ts`: 오프스크린 `<canvas>`(1080×1080)에 배경 + 질문 텍스트 + 큰 YES/NO + 하단 워터마크를 그려 `toDataURL('image/png')` 반환. 폰트는 시스템 폰트 스택 사용(웹폰트 로딩 실패로 카드가 깨지지 않게).

- **이미지 저장** — `data:image/png;base64,` 프리픽스를 잘라내고 `File.saveBase64({ data, fileName: 'yesno-<timestamp>.png', mimeType: 'image/png' })`
- **텍스트 공유** — `Share.createLink({ path: 'intoss://<appName>' })`로 링크를 받아 `Share.sendMessage`에 조합:
  ```
  오늘 치킨 먹을까?

  YES

  <toss link>
  ```
- 두 API 모두 구버전 토스 앱/권한 거부 시 실패할 수 있으므로 `try/catch`로 감싸고 실패 시 토스트만 띄우고 앱은 계속 동작하게 합니다.

### Phase 6 — 저장소
`Storage.setItem`으로 **마지막 질문 1개만** 저장해 재진입 시 입력창에 복원합니다. 기획서상 통계/히스토리는 MVP 제외이므로 그 이상 저장하지 않습니다. 모든 Storage 호출은 `await` (비동기 API).

### Phase 7 — 심사 대비 & 배포
- 결과 화면에 **"재미로 보는 결과예요"** 문구 고정 — 랜덤 결과 앱이 운세/사행성으로 오인되지 않게 하는 방어선. 금전·베팅·확률 구매 요소는 일절 없음.
- 개인정보 수집 없음(서버 없음, 질문은 기기에만 저장) — 심사 문의 대비해 명시할 수 있게 정리.
- `permissions: []` 유지 — 불필요한 권한 요청은 반려 사유가 됩니다.
- `npm run build` → 번들 용량 확인(**압축 해제 기준 100MB 이하**, 이 앱은 여유).
- 콘솔에서 **테스트 최소 1회 이상** 수행 후 '검토 요청하기'. **심사는 영업일 기준 최대 3일**. 승인 후 '출시하기'를 누르면 즉시 전체 사용자에게 반영됩니다.

---

## 검증 방법

1. **단위 테스트** — `npm test`로 `decide.test.ts` 통과 (분포 49~51%).
2. **로컬 브라우저** — `npm run dev` 후 모바일 뷰포트로 전체 플로우: 질문 입력 → 결정 → 연출 → 결과 → 다시 하기 → 공유.
3. **실기기(토스 테스트앱/샌드박스)** — SDK 호출은 브라우저에서 검증 불가하므로 반드시 실기기에서:
   - `File.saveBase64` 후 기기 갤러리에 카드 이미지가 실제로 생기는지
   - `Share.sendMessage`가 토스 공유 시트를 띄우는지
   - 앱 종료 후 재진입 시 마지막 질문이 복원되는지
   - `intoss://<appName>` 딥링크로 앱이 열리는지
4. **연출 회귀 확인** — 연출 중 뒤로가기/백그라운드 전환 후 복귀 시 결과가 바뀌지 않는지.

---

## 확인이 필요한 사항 (구현 중 문서로 검증)

- **햅틱 피드백**: 결과 공개 순간 진동을 넣으면 체감이 크게 좋아집니다. 앱인토스 SDK의 햅틱 API 존재 여부를 Phase 4에서 문서로 확인하고, 없으면 생략합니다(웹 `navigator.vibrate`는 토스 WebView에서 동작을 보장할 수 없음).
- **`Share.createLink`의 `ogImageUrl`**: 결과 이미지를 OG 이미지로 넣으려면 공개 URL이 필요한데 서버가 없습니다. MVP에서는 고정 앱 대표 이미지(콘솔 업로드 URL)를 쓰거나 생략합니다.
- **`appName` 확정값** — Phase 0 완료 시 `granite.config.ts`와 딥링크 문자열에 반영.

---

## 범위 밖 (기획서 9장 향후 업데이트 그대로 보류)

MAYBE 모드 / 결과별 코멘트 / 테마 변경 / 오늘의 질문 / 친구와 함께 결정하기 / 룰렛. 다만 Phase 2의 `decide()`는 `Answer` 유니온 타입으로 두어 나중에 `'MAYBE'` 추가가 한 줄로 끝나게 설계합니다.

- **햅틱 피드백**: 결과 공개 순간 진동을 넣으면 체감이 크게 좋아집니다. 앱인토스 SDK의 햅틱 API 존재 여부를 Phase 4에서 문서로 확인하고, 없으면 생략합니다(웹 `navigator.vibrate`는 토스 WebView에서 동작을 보장할 수 없음).
- **`Share.createLink`의 `ogImageUrl`**: 결과 이미지를 OG 이미지로 넣으려면 공개 URL이 필요한데 서버가 없습니다. MVP에서는 고정 앱 대표 이미지(콘솔 업로드 URL)를 쓰거나 생략합니다.
- **`appName` 확정값** — Phase 0 완료 시 `granite.config.ts`와 딥링크 문자열에 반영.

---

## 범위 밖 (기획서 9장 향후 업데이트 그대로 보류)

MAYBE 모드 / 결과별 코멘트 / 테마 변경 / 오늘의 질문 / 친구와 함께 결정하기 / 룰렛. 다만 Phase 2의 `decide()`는 `Answer` 유니온 타입으로 두어 나중에 `'MAYBE'` 추가가 한 줄로 끝나게 설계합니다.

- 한쪽 확률 약간 높이기 체크박스
- 한국인은 삼세번! 세번 연달아 뽑는 체크박스