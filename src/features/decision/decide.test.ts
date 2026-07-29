import { describe, expect, it } from 'vitest';
import { TILT_PERCENT, decide, yesPercent } from './decide';
import { DEFAULT_OPTIONS, normalizeOptions } from './options';
import { SUGGESTIONS, pickSuggestions } from './suggestions';

const TRIALS = 100_000;

describe('decide', () => {
  it('항상 YES 또는 NO를 반환한다', () => {
    for (let i = 0; i < 1_000; i++) {
      expect(['YES', 'NO']).toContain(decide());
    }
  });

  it('YES 비율이 49~51% 안에 든다', () => {
    let yes = 0;
    for (let i = 0; i < TRIALS; i++) {
      if (decide() === 'YES') yes++;
    }
    const ratio = yes / TRIALS;
    expect(ratio).toBeGreaterThanOrEqual(0.49);
    expect(ratio).toBeLessThanOrEqual(0.51);
  });

  it.each(['YES', 'NO'] as const)('%s로 기울이면 그쪽 비율이 64~66% 안에 든다', (tilt) => {
    let hits = 0;
    for (let i = 0; i < TRIALS; i++) {
      if (decide(tilt) === tilt) hits++;
    }
    const ratio = hits / TRIALS;
    expect(ratio).toBeGreaterThanOrEqual(0.64);
    expect(ratio).toBeLessThanOrEqual(0.66);
  });
});

describe('yesPercent', () => {
  it('기울이지 않으면 반반이다', () => {
    expect(yesPercent(null)).toBe(50);
  });

  it.each(['YES', 'NO'] as const)('%s로 기울이면 그쪽이 TILT_PERCENT를 가져간다', (tilt) => {
    const yes = yesPercent(tilt);
    expect(tilt === 'YES' ? yes : 100 - yes).toBe(TILT_PERCENT);
  });

  it('양쪽을 더하면 항상 100이다', () => {
    ([null, 'YES', 'NO'] as const).forEach((tilt) => {
      const yes = yesPercent(tilt);
      expect(yes + (100 - yes)).toBe(100);
      expect(yes).toBeGreaterThan(0);
      expect(yes).toBeLessThan(100);
    });
  });
});

describe('normalizeOptions', () => {
  it('올바른 값은 그대로 통과시킨다', () => {
    expect(normalizeOptions({ tilt: 'YES', bestOfThree: true })).toEqual({
      tilt: 'YES',
      bestOfThree: true,
    });
  });

  it.each([null, undefined, 'YES', 42, {}, { tilt: 'MAYBE', bestOfThree: 'on' }])(
    '깨진 값(%o)은 기본값으로 수렴한다',
    (raw) => {
      expect(normalizeOptions(raw)).toEqual(DEFAULT_OPTIONS);
    },
  );
});

describe('pickSuggestions', () => {
  it('요청한 개수만큼 중복 없이 반환한다', () => {
    const picked = pickSuggestions(4);
    expect(picked).toHaveLength(4);
    expect(new Set(picked).size).toBe(4);
    picked.forEach((q) => expect(SUGGESTIONS).toContain(q));
  });

  it('매 호출마다 순서가 고정되지 않는다', () => {
    const runs = Array.from({ length: 20 }, () => pickSuggestions().join('|'));
    expect(new Set(runs).size).toBeGreaterThan(1);
  });
});
