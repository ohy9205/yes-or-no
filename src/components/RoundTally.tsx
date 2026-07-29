import { css } from '@emotion/react';
import type { Answer } from '../features/decision/decide';
import { MAX_ROUNDS, scoreText } from '../features/decision/series';
import { answerColor, theme } from '../styles/theme';

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
    <div css={container}>
      <div css={dots} aria-hidden>
        {SLOTS.map((index) => {
          const drawn = draws[index];
          return (
            <span
              key={index}
              css={[dot, drawn && filled]}
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
  gap: theme.space.sm,
});

const dots = css({
  display: 'flex',
  alignItems: 'center',
  gap: theme.space.sm,
});

const dot = css({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: theme.color.subText,
  opacity: 0.25,
  transition: 'opacity 160ms ease-out, transform 160ms ease-out',
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
});

const filled = css({
  opacity: 1,
  transform: 'scale(1.2)',
});

const score = css({
  margin: 0,
  fontSize: '14px',
  fontWeight: 600,
  color: theme.color.text,
});

const hidden = css({
  visibility: 'hidden',
});
