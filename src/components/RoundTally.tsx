import { css, keyframes } from '@emotion/react';
import type { Answer } from '../features/decision/decide';
import { MAX_ROUNDS, scoreText } from '../features/decision/series';
import { answerColor, font, theme } from '../styles/theme';

interface Props {
  /** 총 판 수. 단판이면 렌더하지 않는다 */
  rounds: number;
  /** 지금까지 공개된 판 */
  draws: Answer[];
  /** 집계 점수 노출 여부 */
  showScore?: boolean;
}

const SLOTS = Array.from({ length: MAX_ROUNDS }, (_, index) => index);

/** 삼세번에서 판별 결과를 점으로, 최종 집계를 점수로 보여주는 영역 */
export function RoundTally({ rounds, draws, showScore = false }: Props) {
  if (rounds < 2) return null;

  return (
    <div css={[container, showScore && rise]}>
      <div css={dots} aria-hidden>
        {SLOTS.map((index) => {
          const drawn = draws[index];
          return (
            <span
              key={index}
              css={dot}
              style={drawn ? { backgroundColor: answerColor[drawn] } : undefined}
            />
          );
        })}
      </div>
      {/* 집계 줄은 숨겨서라도 자리를 잡아 연출 → 결과 전환에서 높이가 바뀌지 않게 한다 */}
      <p css={[score, !showScore && hidden]} aria-hidden={!showScore}>
        {scoreText(draws)}
      </p>
    </div>
  );
}

const container = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
});

/** 결과 화면에서만 — 대형 타이포가 터진 뒤 집계가 뒤따라 올라온다 */
const riseIn = keyframes({
  from: { opacity: 0, transform: 'translateY(10px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

const rise = css({
  animation: `${riseIn} 300ms ease-out both`,
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
  },
});

const dots = css({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.sm,
});

const dot = css({
  width: '12px',
  height: '12px',
  borderRadius: theme.radius.pill,
  backgroundColor: theme.color.fill,
  transition: 'background-color 200ms ease-out',
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
});

const score = css({
  ...font.bodyBold,
  margin: 0,
  color: theme.color.text,
});

const hidden = css({
  visibility: 'hidden',
});
