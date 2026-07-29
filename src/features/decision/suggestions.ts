/** 입력창이 비었을 때 채워 넣을 추천 질문 */
export const SUGGESTIONS = [
  '치킨 먹을까?',
  '외식할까?',
  '산책 갈까?',
  '운동 갈까?',
  '먼저 연락해볼까?',
  '배달 시킬까?',
  '주말에 여행 갈까?',
  '머리 자를까?',
  '커피 마실까?',
  '그냥 내일 할까?',
  '영화 볼까?',
  '책 읽을까?',
  '게임 한 판 할까?',
  '공부할까?',
  '청소할까?',
  '이거 살까?',
  '야식 먹을까?',
  'SNS 올릴까?',
  '지금 시작할까?',
  '내가 참을까?',
  '고백할까?',
  '살까?',
  '먹을까?'
] as const;

export type Suggestion = (typeof SUGGESTIONS)[number];

/** 셔플해서 앞에서 count개만 반환 */
export function pickSuggestions(count = 4): Suggestion[] {
  const pool = [...SUGGESTIONS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}
