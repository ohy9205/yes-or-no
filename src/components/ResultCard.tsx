import { css } from '@emotion/react';
import type { Answer } from '../features/decision/decide';
import { answerColor, theme } from '../styles/theme';

interface Props {
  question: string;
  answer: Answer;
}

/** 질문과 결과를 화면 가득 보여주는 결과 영역 */
export function ResultCard({ question, answer }: Props) {
  return (
    <div css={container}>
      <p css={questionText}>{question}</p>
      <strong css={[answerText, css({ color: answerColor[answer] })]}>{answer}</strong>
      <p css={disclaimer}>재미로 보는 결과예요</p>
    </div>
  );
}

const container = css({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.space.md,
  textAlign: 'center',
});

const questionText = css({
  margin: 0,
  fontSize: '18px',
  fontWeight: 600,
  color: theme.color.subText,
  wordBreak: 'keep-all',
});

const answerText = css({
  fontSize: '30vw',
  fontWeight: 800,
  lineHeight: 1,
  letterSpacing: '-0.03em',
});

const disclaimer = css({
  margin: 0,
  fontSize: '13px',
  color: theme.color.subText,
});
