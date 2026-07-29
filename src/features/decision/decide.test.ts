import { describe, expect, it } from 'vitest';
import { decide } from './decide';
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
