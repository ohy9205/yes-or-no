/** 입력창이 비었을 때 채워 넣을 추천 질문 */
export const SUGGESTIONS = [
  '오늘 치킨 먹을까?',
  '지금 자러 갈까?',
  '이거 살까?',
  '오늘 운동 갈까?',
  '먼저 연락해볼까?',
  '배달 시킬까?',
  '주말에 여행 갈까?',
  '머리 자를까?',
  '커피 마실까?',
  '내일로 미룰까?',
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
