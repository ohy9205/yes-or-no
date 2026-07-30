export type Answer = 'YES' | 'NO';

/** 추첨을 기울일 방향. null이면 기울이지 않는다 */
export type Tilt = Answer | null;

/** 기울였을 때 그쪽이 나올 확률 */
const TILT_RATE = 0.65;

/** 화면·공유 문구에 표기하는 기울임 확률 */
export const TILT_PERCENT = Math.round(TILT_RATE * 100);

/** 기울인 비율을 알리는 문구. 기울이지 않았으면 null */
export function tiltText(tilt: Tilt): string | null {
  return tilt === null ? null : `${tilt} 쪽 확률 ${TILT_PERCENT}%`;
}

/** 기울임을 반영한 YES 확률(%). NO 확률은 100에서 뺀 값이다 */
export function yesPercent(tilt: Tilt): number {
  if (tilt === null) return 50;
  return tilt === 'YES' ? TILT_PERCENT : 100 - TILT_PERCENT;
}

export function opposite(answer: Answer): Answer {
  return answer === 'YES' ? 'NO' : 'YES';
}

/** 기울이지 않으면 50:50, 기울이면 그쪽이 TILT_RATE 확률로 나온다 */
export function decide(tilt: Tilt = null): Answer {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  const roll = buf[0] / 2 ** 32;
  if (tilt === null) return roll < 0.5 ? 'YES' : 'NO';
  return roll < TILT_RATE ? tilt : opposite(tilt);
}
