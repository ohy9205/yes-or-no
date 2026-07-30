import { css } from '@emotion/react';
import { Text } from '@toss/tds-mobile';
import { tiltText, type Answer, type Tilt } from '../features/decision/decide';
import { SERIES_MS, SINGLE_MS } from '../features/decision/timeline';
import type { Phase } from '../features/decision/usePhase';
import {
  stageContainer,
  stageLineHeight,
  stageNotes,
  stageQuestion,
  stageSlot,
} from '../styles/stage';
import { theme } from '../styles/theme';
import { AnswerRow } from './AnswerRow';
import { SeriesScore } from './SeriesScore';

interface Props {
  question: string;
  phase: Exclude<Phase, 'idle' | 'revealed'>;
  rounds: number;
  /** 화면에 세워둔 릴 */
  reels: Answer[];
  /** 지금까지 공개된 판 */
  draws: Answer[];
  tilt: Tilt;
}

/** 룰렛이 돌다 결과에서 멈추는 연출 영역 */
export function RevealStage({ question, phase, rounds, reels, draws, tilt }: Props) {
  const single = rounds === 1;
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
        <AnswerRow
          answers={reels}
          spinning={phase === 'spinning'}
          duration={single ? SINGLE_MS.spinning : SERIES_MS.spinning}
          size={single ? 'large' : 'small'}
        />
      </div>
      {/* 릴이 결과 화면에서 내려앉을 자리. 미리 비워둬야 질문·문구가 밀리지 않는다 */}
      {!single && <div style={{ height: stageLineHeight('small') }} aria-hidden />}
      <SeriesScore rounds={rounds} draws={draws} />
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

/** 결과 화면의 안내 문구 자리만 미리 잡아둔다 */
const placeholder = css({
  visibility: 'hidden',
});
