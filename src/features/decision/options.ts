import type { Tilt } from './decide';

export interface DecisionOptions {
  tilt: Tilt;
  bestOfThree: boolean;
}

export const DEFAULT_OPTIONS: DecisionOptions = { tilt: null, bestOfThree: false };

/** 저장소에서 읽은 값처럼 신뢰할 수 없는 입력을 옵션으로 정리한다 */
export function normalizeOptions(raw: unknown): DecisionOptions {
  if (typeof raw !== 'object' || raw === null) return DEFAULT_OPTIONS;
  const { tilt, bestOfThree } = raw as Partial<DecisionOptions>;
  return {
    tilt: tilt === 'YES' || tilt === 'NO' ? tilt : null,
    bestOfThree: bestOfThree === true,
  };
}
