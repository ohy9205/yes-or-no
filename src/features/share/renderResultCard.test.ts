import { describe, expect, it } from 'vitest';
import { wrapText, type TextMeasurer } from './renderResultCard';

/** 글자당 폭 10px로 가정한 가짜 컨텍스트 */
const ctx: TextMeasurer = {
  measureText: (text: string) => ({ width: text.length * 10 }) as TextMetrics,
};

const MAX_WIDTH = 100; // 한 줄에 10글자

describe('wrapText', () => {
  it('한 줄에 들어가면 그대로 둔다', () => {
    expect(wrapText(ctx, '치킨 먹을까', MAX_WIDTH, 3)).toEqual(['치킨 먹을까']);
  });

  it('어절 단위로 줄을 나눈다', () => {
    expect(wrapText(ctx, '오늘 저녁에 치킨을 먹을까', MAX_WIDTH, 3)).toEqual([
      '오늘 저녁에 치킨을',
      '먹을까',
    ]);
  });

  it('띄어쓰기 없는 긴 한국어도 글자 단위로 끊는다', () => {
    const lines = wrapText(ctx, '오늘저녁에치킨을먹어도될까요', MAX_WIDTH, 3);
    expect(lines).toEqual(['오늘저녁에치킨을먹어', '도될까요']);
    lines.forEach((line) => expect(line.length).toBeLessThanOrEqual(10));
  });

  it('최대 줄 수를 넘으면 마지막 줄을 말줄임한다', () => {
    const lines = wrapText(ctx, '가나다라마바사아자차카타파하가나다라마바사아자차', MAX_WIDTH, 2);
    expect(lines).toHaveLength(2);
    expect(lines[1].endsWith('…')).toBe(true);
    lines.forEach((line) => expect(line.length).toBeLessThanOrEqual(10));
  });

  it('빈 문자열은 줄을 만들지 않는다', () => {
    expect(wrapText(ctx, '', MAX_WIDTH, 3)).toEqual([]);
  });
});
