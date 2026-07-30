import { css, keyframes } from '@emotion/react';
import { Text } from '@toss/tds-mobile';
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
      {/* 숨길 때도 자리는 유지한다 */}
      <Text
        typography="t7"
        fontWeight="semibold"
        color={theme.color.text}
        css={!showScore && hidden}
        aria-hidden={!showScore}
      >
        {scoreText(draws)}
      </Text>
    </div>
  );
}

const container = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
});

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

const hidden = css({
  visibility: 'hidden',
});
