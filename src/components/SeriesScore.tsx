import { css } from '@emotion/react';
import { Text } from '@toss/tds-mobile';
import type { Answer } from '../features/decision/decide';
import { scoreText } from '../features/decision/series';
import { theme } from '../styles/theme';

interface Props {
  /** 총 판 수. 단판이면 렌더하지 않는다 */
  rounds: number;
  /** 지금까지 공개된 판 */
  draws: Answer[];
  /** 집계 점수 노출 여부 */
  showScore?: boolean;
}

/** 삼세번의 최종 집계를 보여주는 줄. 판별 결과는 릴이 직접 들고 있다 */
export function SeriesScore({ rounds, draws, showScore = false }: Props) {
  if (rounds < 2) return null;

  return (
    // 숨길 때도 자리는 유지한다
    <Text
      typography="t7"
      fontWeight="semibold"
      color={theme.color.text}
      css={!showScore && hidden}
      aria-hidden={!showScore}
    >
      {scoreText(draws)}
    </Text>
  );
}

const hidden = css({
  visibility: 'hidden',
});
