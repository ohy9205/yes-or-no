import { describe, expect, it } from 'vitest';
import { buildShareMessage } from './shareResult';

describe('buildShareMessage', () => {
  it('질문 · 결과 · 링크를 빈 줄로 구분해 잇는다', () => {
    expect(buildShareMessage('오늘 치킨 먹을까?', 'YES', 'https://toss.im/x')).toBe(
      '오늘 치킨 먹을까?\n\nYES\n\nhttps://toss.im/x'
    );
  });

  it('링크 생성이 실패하면 링크 없이 조합한다', () => {
    expect(buildShareMessage('오늘 치킨 먹을까?', 'NO')).toBe('오늘 치킨 먹을까?\n\nNO');
  });
});
