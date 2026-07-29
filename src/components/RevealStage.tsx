import { css, keyframes } from '@emotion/react';
import { stageQuestion, stageText, stageContainer } from '../styles/stage';
import { theme } from '../styles/theme';

interface Props {
  question: string;
  phase: 'rolling' | 'teasing';
}

const DOTS = [0, 1, 2];

/** 결과가 나오기 전 `...` → `???` 를 재생하는 연출 영역 */
export function RevealStage({ question, phase }: Props) {
  return (
    <div css={stageContainer}>
      <p css={stageQuestion}>{question}</p>
      {phase === 'rolling' ? (
        <div css={[stageText, dots]} aria-label="결정하는 중">
          {DOTS.map((i) => (
            <span key={i} css={dot} style={{ animationDelay: `${i * 160}ms` }} />
          ))}
        </div>
      ) : (
        <strong css={[stageText, teaseText]} aria-label="결과 공개 직전">
          ???
        </strong>
      )}
      <p css={placeholder} aria-hidden>
        재미로 보는 결과예요
      </p>
    </div>
  );
}

const blink = keyframes({
  '0%, 70%, 100%': { opacity: 0.2, transform: 'translateY(0)' },
  '35%': { opacity: 1, transform: 'translateY(-14%)' },
});

const shake = keyframes({
  '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
  '25%': { transform: 'translateX(-3%) rotate(-3deg)' },
  '75%': { transform: 'translateX(3%) rotate(3deg)' },
});

const dots = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.28em',
});

const dot = css({
  width: '0.34em',
  height: '0.34em',
  borderRadius: '50%',
  backgroundColor: theme.color.text,
  animation: `${blink} 900ms ease-in-out infinite`,
});

const teaseText = css({
  color: theme.color.text,
  animation: `${shake} 300ms ease-in-out infinite`,
});

/** 결과 화면의 안내 문구 자리를 미리 잡아 연출 중 레이아웃이 흔들리지 않게 함 */
const placeholder = css({
  margin: 0,
  fontSize: '13px',
  lineHeight: 1.4,
  visibility: 'hidden',
});
