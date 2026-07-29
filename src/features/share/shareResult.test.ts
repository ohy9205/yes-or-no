import { describe, expect, it } from 'vitest';
import type { DecisionResult } from '../decision/result';
import { buildShareMessage } from './shareResult';

const QUESTION = '오늘 치킨 먹을까?';
const LINK = 'https://toss.im/x';

function result(overrides: Partial<DecisionResult> = {}): DecisionResult {
  return { question: QUESTION, answer: 'YES', draws: ['YES'], tilt: null, ...overrides };
}

describe('buildShareMessage', () => {
  it('질문 · 결과 · 링크를 빈 줄로 구분해 잇는다', () => {
    expect(buildShareMessage(result(), LINK)).toBe(`${QUESTION}\n\nYES\n\n${LINK}`);
  });

  it('링크 생성이 실패하면 링크 없이 조합한다', () => {
    expect(buildShareMessage(result({ answer: 'NO', draws: ['NO'] }))).toBe(`${QUESTION}\n\nNO`);
  });

  it('삼세번이면 결과 옆에 집계를 붙인다', () => {
    expect(buildShareMessage(result({ draws: ['YES', 'NO', 'YES'] }), LINK)).toBe(
      `${QUESTION}\n\nYES (삼세번 2:1)\n\n${LINK}`
    );
  });

  it('기울였으면 결과 아래 확률을 붙인다', () => {
    expect(buildShareMessage(result({ tilt: 'YES' }), LINK)).toBe(
      `${QUESTION}\n\nYES\nYES 쪽 확률 65%\n\n${LINK}`
    );
  });

  it('기울인 삼세번은 집계와 확률을 함께 붙인다', () => {
    expect(buildShareMessage(result({ draws: ['YES', 'YES'], tilt: 'YES' }), LINK)).toBe(
      `${QUESTION}\n\nYES (삼세번 2:0)\nYES 쪽 확률 65%\n\n${LINK}`
    );
  });
});
