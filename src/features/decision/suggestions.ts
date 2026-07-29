/** 입력창이 비었을 때 채워 넣을 추천 질문 */
export const SUGGESTIONS = [
  '오늘 외식할까?',
  '지금 산책 갈까?',
  '오늘 일찍 잘까?',
  '커피 한 잔 마실까?',
  '운동하러 갈까?',
  '영화 볼까?',
  '게임 한 판 할까?',
  '책 읽을까?',
  '공부 시작할까?',
  '청소할까?',
  '오늘은 집에서 쉴까?',
  '친구에게 연락해볼까?',
  '새로운 취미를 시작할까?',
  '이 옷 살까?',
  '머리 스타일 바꿀까?',
  '주말에 드라이브 갈까?',
  '저축을 더 할까?',
  '오늘 야식 먹을까?',
  'SNS에 올릴까?',
  '지금 시작할까?',
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
