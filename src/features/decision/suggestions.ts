/** 입력창이 비었을 때 채워 넣을 추천 질문 */
export const SUGGESTIONS = [
  '늦잠 잘까?',
  '일찍 잘까?',
  '새로 시작할까?',
  '그만둘까?',
  '이직할까?',
  '헬스장 끊을까?',
  '반려동물 키울까?',
  '여기서 살까?',
  '혼자 갈까?',
  '같이 갈까?',
  '연차 쓸까?',
  '택시 탈까?',
  '걸어갈까?',
  '한 잔 할까?',
  '담배 끊을까?',
  '다이어트 할까?',
  '이 옷 입을까?',
  '환불할까?',
  '더 기다릴까?',
  '포기할까?',
  '다시 도전할까?',
  '연락 끊을까?',
  '먼저 사과할까?',
  '솔직하게 말할까?',
  '비밀로 할까?',
  '오늘 쉴까?',
  '알바 구할까?',
  '적금 들까?',
  '주식 살까?',
  '이사 갈까?',
  '유튜브 시작할까?',
  '블로그 써볼까?',
  '자격증 딸까?',
  '어학연수 갈까?',
  '문신 할까?',
  '파마할까?',
  '살 뺄까?',
  '눈썹 정리할까?',
  '캠핑 갈까?',
  '낚시 갈까?',
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
