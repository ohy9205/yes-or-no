export type StagePhase = 'spinning' | 'roundResult' | 'revealed';

export interface Segment {
  phase: StagePhase;
  /** 몇 번째 판인지(0부터) */
  round: number;
  /** 연출 시작 시각 기준 이 구간이 끝나는 시각(ms) */
  endsAt: number;
}

/** 단판 연출의 구간 길이(ms) */
export const SINGLE_MS = { spinning: 1_800 } as const;
/** 삼세번 연출의 구간 길이(ms) */
export const SERIES_MS = { spinning: 800, roundResult: 380 } as const;

/**
 * 판 수에 맞춰 누적 종료 시각이 담긴 구간 목록을 만든다.
 * 마지막 판은 roundResult 없이 곧장 revealed로 들어간다.
 */
export function buildTimeline(rounds: number): Segment[] {
  const ms = rounds === 1 ? SINGLE_MS : SERIES_MS;
  const segments: Segment[] = [];
  let endsAt = 0;

  const push = (phase: StagePhase, round: number, duration: number) => {
    endsAt += duration;
    segments.push({ phase, round, endsAt });
  };

  for (let round = 0; round < rounds; round++) {
    push('spinning', round, ms.spinning);
    if (round < rounds - 1) push('roundResult', round, SERIES_MS.roundResult);
  }
  segments.push({ phase: 'revealed', round: rounds - 1, endsAt: Infinity });
  return segments;
}

/** 경과 시간이 속한 구간. 시간이 크게 밀려도 마지막 구간에 머문다 */
export function frameAt(elapsed: number, timeline: Segment[]): Segment {
  return timeline.find((segment) => elapsed < segment.endsAt) ?? timeline[timeline.length - 1];
}

/** 해당 구간까지 공개된 판 수 */
export function revealedCount(segment: Segment, rounds: number): number {
  if (segment.phase === 'revealed') return rounds;
  return segment.phase === 'roundResult' ? segment.round + 1 : segment.round;
}
