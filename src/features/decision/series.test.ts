import { describe, expect, it } from 'vitest';
import type { Answer } from './decide';
import { drawSeries, tally, winner } from './series';

const TRIALS = 5_000;

describe('drawSeries', () => {
  it('판 수가 항상 2 또는 3이다', () => {
    for (let i = 0; i < TRIALS; i++) {
      expect([2, 3]).toContain(drawSeries().length);
    }
  });

  it('첫 두 판이 같으면 2판, 갈리면 3판에서 끝난다', () => {
    for (let i = 0; i < TRIALS; i++) {
      const draws = drawSeries();
      expect(draws.length).toBe(draws[0] === draws[1] ? 2 : 3);
    }
  });

  it('기울인 쪽이 이기는 비율이 절반을 넘는다', () => {
    let yes = 0;
    for (let i = 0; i < TRIALS; i++) {
      if (winner(drawSeries('YES')) === 'YES') yes++;
    }
    expect(yes / TRIALS).toBeGreaterThan(0.5);
  });
});

describe('winner', () => {
  const cases: Array<[Answer[], Answer]> = [
    [['YES', 'YES'], 'YES'],
    [['NO', 'NO'], 'NO'],
    [['YES', 'NO', 'YES'], 'YES'],
    [['NO', 'YES', 'NO'], 'NO'],
  ];

  it.each(cases)('%o의 승자는 %s', (draws, expected) => {
    expect(winner(draws)).toBe(expected);
  });

  it('어떤 판 목록에도 YES 또는 NO를 반환한다', () => {
    for (let i = 0; i < TRIALS; i++) {
      expect(['YES', 'NO']).toContain(winner(drawSeries()));
    }
  });
});

describe('tally', () => {
  it('판 목록을 답변별로 센다', () => {
    expect(tally(['YES', 'NO', 'YES'])).toEqual({ YES: 2, NO: 1 });
  });
});
