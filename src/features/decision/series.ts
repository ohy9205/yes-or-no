import { decide, type Answer, type Tilt } from './decide';

/** 이기는 데 필요한 판 수 */
export const WINS_NEEDED = 2;
/** 최대 판 수 */
export const MAX_ROUNDS = 3;

/** 3판 2선승. 2승이 확정되면 남은 판은 뽑지 않는다 */
export function drawSeries(tilt: Tilt = null): Answer[] {
  const draws: Answer[] = [];
  while (draws.length < MAX_ROUNDS) {
    draws.push(decide(tilt));
    if (tally(draws)[winner(draws)] >= WINS_NEEDED) break;
  }
  return draws;
}

export function tally(draws: Answer[]): Record<Answer, number> {
  return {
    YES: draws.filter((d) => d === 'YES').length,
    NO: draws.filter((d) => d === 'NO').length,
  };
}

/** `YES 2 : 1 NO` 형태의 집계 문구 */
export function scoreText(draws: Answer[]): string {
  const counts = tally(draws);
  return `YES ${counts.YES} : ${counts.NO} NO`;
}

/** 많이 나온 답. 동점이면 마지막 판을 따른다 */
export function winner(draws: Answer[]): Answer {
  const counts = tally(draws);
  if (counts.YES === counts.NO) return draws[draws.length - 1];
  return counts.YES > counts.NO ? 'YES' : 'NO';
}
