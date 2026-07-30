import { css } from '@emotion/react';
import type { CSSProperties } from 'react';
import { theme } from './theme';

/** 연출(`RevealStage`)과 결과(`ResultCard`)가 공유하는 레이아웃 */
export const stageContainer = css({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.space.md,
  padding: `0 ${theme.space.lg}`,
  textAlign: 'center',
});

export const stageQuestion = css({
  margin: 0,
  wordBreak: 'keep-all',
});

/** 글자 한 줄이 글자 크기의 몇 배를 차지하는지 */
export const STAGE_LINE_HEIGHT = 1.1;

/** 릴과 결과 글자의 크기. small은 릴 셋이 좌우 여백 안에 들어가는 값이다 */
const STAGE_FONT_SIZE = {
  large: 'min(28vw, 176px)',
  small: 'min(12vw, 52px)',
} as const;

export type StageSize = keyof typeof STAGE_FONT_SIZE;

/** 글자 한 줄이 차지하는 높이. 릴 칸 높이가 이 값과 어긋나면 착지 위치가 틀어진다 */
export function stageLineHeight(size: StageSize) {
  return `calc(${STAGE_FONT_SIZE[size]} * ${STAGE_LINE_HEIGHT})`;
}

/** 글자 모서리를 깎는 둥근 외곽선의 두께. 글자 크기 대비 비율 */
export const GLYPH_ROUND = 0.1;

/** 글자 사이. 외곽선이 글자를 양옆으로 넓히는 만큼 미리 벌려 붙지 않게 한다 */
export const STAGE_TRACKING = GLYPH_ROUND / 2;

/** 외곽선이 글자 상자 밖으로 나가는 여유 */
export function stageRoundInset(size: StageSize) {
  return `calc(${STAGE_FONT_SIZE[size]} * ${GLYPH_ROUND / 2})`;
}

const stageTypo = {
  fontWeight: 700,
  lineHeight: STAGE_LINE_HEIGHT,
  letterSpacing: `${STAGE_TRACKING}em`,
} as const;

/** 릴 한 칸과 결과 글자의 타이포. TDS 타이포 스케일 밖이라 style로 직접 얹는다 */
export function stageGlyph(size: StageSize): CSSProperties {
  return { ...stageTypo, fontSize: STAGE_FONT_SIZE[size] };
}

/** 대형 타이포가 차지할 높이를 고정하는 슬롯 */
export const stageSlot = css({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: stageLineHeight('large'),
  // 결과 글자가 눕혔다 일어서는 각도의 소실점
  perspective: '900px',
});

/** 결과 아래 작은 안내 문구 묶음 */
export const stageNotes = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});
