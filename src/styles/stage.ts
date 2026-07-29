import { css } from '@emotion/react';
import { theme } from './theme';

/**
 * 연출(`RevealStage`)과 결과(`ResultCard`)가 공유하는 레이아웃.
 * 두 화면의 골격을 맞춰 `...` → `???` → `YES!` 전환에서 위치가 튀지 않게 한다.
 */
export const stageContainer = css({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.space.md,
  textAlign: 'center',
});

export const stageQuestion = css({
  margin: 0,
  fontSize: '18px',
  fontWeight: 600,
  color: theme.color.subText,
  wordBreak: 'keep-all',
});

/** 화면을 채우는 대형 타이포 */
export const stageText = css({
  fontSize: 'min(28vw, 200px)',
  fontWeight: 800,
  lineHeight: 1.1,
  letterSpacing: '-0.03em',
});
