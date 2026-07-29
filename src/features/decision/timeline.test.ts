import { describe, expect, it } from 'vitest';
import {
  SERIES_MS,
  SINGLE_MS,
  buildTimeline,
  frameAt,
  revealedCount,
  type Segment,
} from './timeline';

/** revealed 직전 구간의 종료 시각 = 총 연출 길이 */
function duration(timeline: Segment[]) {
  return timeline[timeline.length - 2].endsAt;
}

describe('buildTimeline', () => {
  it('단판은 rolling → teasing → revealed 로 1.3초를 넘지 않는다', () => {
    const timeline = buildTimeline(1);
    expect(timeline.map((s) => s.phase)).toEqual(['rolling', 'teasing', 'revealed']);
    expect(duration(timeline)).toBe(SINGLE_MS.rolling + SINGLE_MS.teasing);
    expect(duration(timeline)).toBeLessThanOrEqual(1_300);
  });

  it('삼세번은 마지막 판에만 roundResult가 없다', () => {
    expect(buildTimeline(2).map((s) => s.phase)).toEqual([
      'rolling',
      'teasing',
      'roundResult',
      'rolling',
      'teasing',
      'revealed',
    ]);
    expect(buildTimeline(3).filter((s) => s.phase === 'roundResult')).toHaveLength(2);
  });

  it('3판이어도 총 연출 시간이 3초를 넘지 않는다', () => {
    expect(duration(buildTimeline(3))).toBeLessThanOrEqual(3_000);
  });

  it.each([1, 2, 3])('%i판 구간의 종료 시각이 단조 증가한다', (rounds) => {
    const ends = buildTimeline(rounds).map((s) => s.endsAt);
    ends.forEach((end, i) => {
      if (i > 0) expect(end).toBeGreaterThan(ends[i - 1]);
    });
  });
});

describe('frameAt', () => {
  it('단판의 경계 직전·직후로 단계가 넘어간다', () => {
    const timeline = buildTimeline(1);
    const total = duration(timeline);
    expect(frameAt(0, timeline).phase).toBe('rolling');
    expect(frameAt(SINGLE_MS.rolling - 1, timeline).phase).toBe('rolling');
    expect(frameAt(SINGLE_MS.rolling, timeline).phase).toBe('teasing');
    expect(frameAt(total - 1, timeline).phase).toBe('teasing');
    expect(frameAt(total, timeline).phase).toBe('revealed');
  });

  it('삼세번은 판 인덱스가 함께 넘어간다', () => {
    const timeline = buildTimeline(2);
    const firstRoundEnd = SERIES_MS.rolling + SERIES_MS.teasing;
    expect(frameAt(0, timeline)).toMatchObject({ phase: 'rolling', round: 0 });
    expect(frameAt(firstRoundEnd, timeline)).toMatchObject({ phase: 'roundResult', round: 0 });
    expect(frameAt(firstRoundEnd + SERIES_MS.roundResult, timeline)).toMatchObject({
      phase: 'rolling',
      round: 1,
    });
  });

  it('백그라운드 복귀처럼 시간이 크게 밀려도 revealed에 머문다', () => {
    const timeline = buildTimeline(3);
    expect(frameAt(duration(timeline) * 100, timeline).phase).toBe('revealed');
  });
});

describe('revealedCount', () => {
  it('연출 중에는 끝난 판까지만, revealed에서는 전부 센다', () => {
    const timeline = buildTimeline(3);
    expect(timeline.map((s) => revealedCount(s, 3))).toEqual([0, 0, 1, 1, 1, 2, 2, 2, 3]);
  });
});
