import { css, keyframes } from '@emotion/react';
import { Text } from '@toss/tds-mobile';
import { tiltText } from '../features/decision/decide';
import type { DecisionResult } from '../features/decision/result';
import { stageContainer, stageNotes, stageQuestion, stageText } from '../styles/stage';
import { answerColor, theme } from '../styles/theme';
import { RoundTally } from './RoundTally';

interface Props {
  result: DecisionResult;
}

/** 질문과 결과를 화면 가득 보여주는 결과 영역 */
export function ResultCard({ result }: Props) {
  const { question, answer, draws, tilt } = result;
  const notice = tiltText(tilt);

  return (
    <div css={stageContainer}>
      <Text
        as="p"
        typography="t6"
        fontWeight="semibold"
        color={theme.color.subText}
        css={stageQuestion}
      >
        {question}
      </Text>
      <Text as="strong" style={stageText} color={answerColor[answer]} css={pop} aria-live="polite">
        {answer}!
      </Text>
      <RoundTally rounds={draws.length} draws={draws} showScore />
      <div css={stageNotes}>
        {notice !== null && (
          <Text typography="st13" fontWeight="semibold" color={theme.color.subText}>
            {`${notice}로 뽑았어요`}
          </Text>
        )}
        <Text typography="st13" fontWeight="medium" color={theme.color.faintText}>
          재미로 보는 결과예요
        </Text>
      </div>
    </div>
  );
}

const reveal = keyframes({
  '0%': { opacity: 0, transform: 'scale(0.55)' },
  '60%': { opacity: 1, transform: 'scale(1.08)' },
  '100%': { transform: 'scale(1)' },
});

const pop = css({
  animation: `${reveal} 420ms cubic-bezier(0.2, 0.8, 0.3, 1) both`,
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
  },
});
