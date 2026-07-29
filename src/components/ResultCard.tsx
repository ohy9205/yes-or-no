import { css, keyframes } from '@emotion/react';
import type { Answer } from '../features/decision/decide';
import { stageContainer, stageQuestion, stageText } from '../styles/stage';
import { answerColor, theme } from '../styles/theme';

interface Props {
  question: string;
  answer: Answer;
}

/** 질문과 결과를 화면 가득 보여주는 결과 영역 */
export function ResultCard({ question, answer }: Props) {
  return (
    <div css={stageContainer}>
      <p css={stageQuestion}>{question}</p>
      <strong css={[stageText, pop, css({ color: answerColor[answer] })]} aria-live="polite">
        {answer}!
      </strong>
      <p css={disclaimer}>재미로 보는 결과예요</p>
    </div>
  );
}

/** 스케일 스프링 + 무채색에서 답변 색으로 물드는 전환 */
const reveal = keyframes({
  '0%': { transform: 'scale(0.4)', opacity: 0, filter: 'grayscale(1)' },
  '55%': { transform: 'scale(1.12)', opacity: 1, filter: 'grayscale(0.35)' },
  '75%': { transform: 'scale(0.95)' },
  '100%': { transform: 'scale(1)', filter: 'grayscale(0)' },
});

const pop = css({
  animation: `${reveal} 520ms cubic-bezier(0.2, 0.8, 0.3, 1) both`,
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
  },
});

const disclaimer = css({
  margin: 0,
  fontSize: '13px',
  lineHeight: 1.4,
  color: theme.color.subText,
});
