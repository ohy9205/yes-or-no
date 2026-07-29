# YES / NO

질문을 입력하면 랜덤으로 YES 또는 NO를 뽑아주는 앱인토스 미니앱입니다.
질문 입력 → 연출 → 결과 → 공유까지 한 화면에서 끝납니다.

## 실행

```bash
npm run dev        # 앱인토스 개발 서버
npm run dev:web    # 브라우저에서만 확인 (SDK 호출은 동작하지 않음)
npm test           # 단위 테스트
npm run build      # 배포 번들
npm run deploy     # 콘솔 업로드
```

## 구조

- `src/features/decision` — 추첨 로직(`decide`), 추천 질문, 연출 상태머신(`usePhase`)
- `src/features/share` — 결과 카드 렌더링, 이미지 저장, 텍스트 공유
- `src/features/storage` — 마지막 질문 저장·복원
- `src/components` — 화면 구성 요소
- `src/styles` — 테마와 연출 레이아웃

## 심사 관련 정리

**개인정보 수집 없음**
서버가 없는 클라이언트 전용 앱입니다. 로그인·계정·회원가입이 없고, 외부로 전송하는 데이터가 없습니다.
저장하는 값은 마지막에 입력한 질문 문자열 **하나뿐**이며, 앱인토스 `Storage` API로 기기에만 보관합니다.
통계·히스토리·분석 도구는 사용하지 않습니다.

**요청 권한 없음**
`granite.config.ts`의 `permissions`는 빈 배열입니다. 카메라·위치·연락처 등 어떤 권한도 요청하지 않습니다.
이미지 저장(`saveBase64Data`)과 공유(`share`)는 사용자가 버튼을 누른 순간에만 호출하고, 실패해도 토스트만 띄우고 앱은 계속 동작합니다.

**사행성·운세 요소 없음**
결과는 `crypto.getRandomValues` 기반의 균등한 50:50 추첨입니다. 확률 보정, 연속 방지, 금전·베팅·확률 구매 요소가 일절 없습니다.
결과 화면과 공유 카드 모두에 **"재미로 보는 결과예요"** 문구를 고정 노출해 운세·점술로 오인되지 않게 했습니다.

**번들 용량**
빌드 산출물 약 1.2MB (압축 해제 기준). 제한인 100MB에 크게 못 미칩니다.

## 배포 전 확인

- [ ] 콘솔에서 `appName` 확정 — `granite.config.ts`와 `src/features/share/shareResult.ts`의 `APP_NAME`이 콘솔 등록값과 같아야 합니다 (현재 둘 다 `yes-or-no`)
- [ ] `granite.config.ts`의 `brand.icon`에 콘솔에 등록한 아이콘 URL 입력
- [ ] 실기기 테스트 — 이미지 저장 / 텍스트 공유 / 햅틱 / 질문 복원 / `intoss://` 딥링크
- [ ] 콘솔에서 테스트 1회 이상 수행 후 '검토 요청하기' (심사 최대 영업일 3일)
