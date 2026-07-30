import type { CSSProperties } from 'react';
import { theme } from './theme';

/** 하단 고정 CTA는 뷰포트 전체 폭을 잡으므로, 본문과 같은 폭으로 맞춰 가운데 세운다 */
export const ctaContainer: CSSProperties = {
  maxWidth: theme.maxWidth,
  margin: '0 auto',
};
