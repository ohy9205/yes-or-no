import type { Answer } from './decide';

/** 릴에 세워둔 칸. 짝수 칸이 YES다 */
export const REEL_CELLS: Answer[] = Array.from({ length: 15 }, (_, index) =>
  index % 2 === 0 ? 'YES' : 'NO',
);

/** 착지 뒤에도 칸이 남아야 멈추며 지나칠 때 빈자리가 보이지 않는다 */
const SPARE_CELLS = 2;

/** 결과 글자에서 멈추도록 고른 칸 */
export function landingIndex(answer: Answer): number {
  return REEL_CELLS.slice(0, REEL_CELLS.length - SPARE_CELLS).lastIndexOf(answer);
}
