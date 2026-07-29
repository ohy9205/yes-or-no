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

const STAGE_FONT_SIZE = 'min(28vw, 200px)';
const STAGE_LINE_HEIGHT = 1.1;

const stageTypo = {
  fontWeight: 800,
  lineHeight: STAGE_LINE_HEIGHT,
  letterSpacing: '-0.03em',
} as const;

/** 화면을 채우는 대형 타이포 */
export const stageText = css({ ...stageTypo, fontSize: STAGE_FONT_SIZE });

/** 판 하나의 결과처럼 잠깐 스쳐 가는 중형 타이포 */
export const stageTextMedium = css({ ...stageTypo, fontSize: 'min(16vw, 110px)' });

/** 대형 타이포가 차지할 높이를 고정해 어떤 연출이 들어와도 화면이 밀리지 않게 함 */
export const stageSlot = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: `calc(${STAGE_FONT_SIZE} * ${STAGE_LINE_HEIGHT})`,
});

/** 결과 아래 작은 안내 문구 묶음 */
export const stageNotes = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const stageNote = css({
  margin: 0,
  fontSize: '13px',
  lineHeight: 1.4,
  color: theme.color.subText,
});
