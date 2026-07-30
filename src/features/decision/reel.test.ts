import { describe, expect, it } from 'vitest';
import type { Answer } from './decide';
import { REEL_CELLS, landingIndex } from './reel';

const ANSWERS: Answer[] = ['YES', 'NO'];

describe('REEL_CELLS', () => {
  it('YES와 NO가 번갈아 놓인다', () => {
    REEL_CELLS.forEach((cell, index) => {
      expect(cell).toBe(index % 2 === 0 ? 'YES' : 'NO');
    });
  });
});

describe('landingIndex', () => {
  it.each(ANSWERS)('%s는 그 글자가 적힌 칸에서 멈춘다', (answer) => {
    expect(REEL_CELLS[landingIndex(answer)]).toBe(answer);
  });

  it.each(ANSWERS)('%s의 착지 칸까지 충분히 돈다', (answer) => {
    expect(landingIndex(answer)).toBeGreaterThanOrEqual(10);
  });

  it.each(ANSWERS)('%s 착지 뒤에도 칸이 남아 있다', (answer) => {
    expect(landingIndex(answer)).toBeLessThan(REEL_CELLS.length - 1);
  });
});
