import type { Answer, Tilt } from './decide';

/** 화면·카드·공유가 함께 쓰는 한 번의 결정 결과 */
export interface DecisionResult {
  question: string;
  /** 최종 결론 */
  answer: Answer;
  /** 뽑은 판 목록. 길이가 1이면 단판 */
  draws: Answer[];
  tilt: Tilt;
}
