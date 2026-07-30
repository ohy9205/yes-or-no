import { css, keyframes } from '@emotion/react';
import { Text } from '@toss/tds-mobile';
import { tiltText, type Answer, type Tilt } from '../features/decision/decide';
import type { Phase } from '../features/decision/usePhase';
import {
  stageContainer,
  stageNotes,
  stageQuestion,
  stageSlot,
  stageText,
  stageTextMedium,
} from '../styles/stage';
import { answerColor, theme } from '../styles/theme';
import { RoundTally } from './RoundTally';

interface Props {
  question: string;
  phase: Exclude<Phase, 'idle' | 'revealed'>;
  rounds: number;
  draws: Answer[];
  tilt: Tilt;
}

const DOTS = [0, 1, 2];

/** 결과가 나오기 전 `...` → `???` 를 재생하는 연출 영역 */
export function RevealStage({ question, phase, rounds, draws, tilt }: Props) {
  const drawn = draws[draws.length - 1];
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
      <div css={stageSlot}>
        {phase === 'rolling' && (
          <div css={dots} style={stageText} aria-label="결정하는 중">
            {DOTS.map((i) => (
              <span key={i} css={dot} style={{ animationDelay: `${i * 160}ms` }} />
            ))}
          </div>
        )}
        {phase === 'teasing' && (
          <Text
            as="strong"
            style={stageText}
            color={theme.color.text}
            css={teaseText}
            aria-label="결과 공개 직전"
          >
            ???
          </Text>
        )}
        {/* key로 판이 바뀔 때마다 등장 애니메이션을 다시 재생시킨다 */}
        {phase === 'roundResult' && (
          <Text
            key={draws.length}
            as="strong"
            style={stageTextMedium}
            color={answerColor[drawn]}
            css={roundText}
          >
            {drawn}
          </Text>
        )}
      </div>
      <RoundTally rounds={rounds} draws={draws} />
      <div css={stageNotes}>
        {notice !== null && (
          <Text typography="st13" fontWeight="medium" color={theme.color.faintText}>
            {`${notice}로 뽑는 중이에요`}
          </Text>
        )}
        <Text
          typography="st13"
          fontWeight="medium"
          color={theme.color.faintText}
          css={placeholder}
          aria-hidden
        >
          재미로 보는 결과예요
        </Text>
      </div>
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

const popIn = keyframes({
  '0%': { transform: 'scale(0.55)', opacity: 0 },
  '60%': { transform: 'scale(1.08)', opacity: 1 },
  '100%': { transform: 'scale(1)' },
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
  animation: `${shake} 300ms ease-in-out infinite`,
});

const roundText = css({
  animation: `${popIn} 240ms cubic-bezier(0.2, 0.8, 0.3, 1) both`,
  '@media (prefers-reduced-motion: reduce)': {
    animation: 'none',
  },
});

/** 결과 화면의 안내 문구 자리만 미리 잡아둔다 */
const placeholder = css({
  visibility: 'hidden',
});
