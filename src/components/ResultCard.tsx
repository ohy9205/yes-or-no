import { css } from '@emotion/react';
import { Text } from '@toss/tds-mobile';
import { motion, useReducedMotion } from 'motion/react';
import { tiltText } from '../features/decision/decide';
import type { DecisionResult } from '../features/decision/result';
import { stageContainer, stageNotes, stageQuestion, stageSlot } from '../styles/stage';
import { answerColor, theme } from '../styles/theme';
import { AnswerFace } from './AnswerFace';
import { AnswerRow } from './AnswerRow';
import { SeriesScore } from './SeriesScore';

interface Props {
  result: DecisionResult;
}

/** 질문과 결과를 화면 가득 보여주는 결과 영역 */
export function ResultCard({ result }: Props) {
  const { question, answer, draws, tilt } = result;
  const single = draws.length === 1;
  const notice = tiltText(tilt);
  const color = answerColor[answer];
  const reduced = useReducedMotion();

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
      <div css={stageSlot} aria-live="polite">
        {/* 확정되는 순간 답 색이 한 번 번진다 */}
        <motion.span
          css={glow}
          style={{ background: `radial-gradient(closest-side, ${color}, transparent)` }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 0.35, 0], scale: 1.6 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          aria-hidden
        />
        {/* 답이 떨어진 자리에서 퍼지는 파장 */}
        <motion.span
          css={ring}
          style={{ borderColor: color }}
          initial={{ opacity: 0.45, scale: 0.3 }}
          animate={{ opacity: 0, scale: 1.7 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          aria-hidden
        />
        <span css={bangAnchor}>
          {/* 눕혀둔 글자가 정면으로 일어서며 두께가 드러난다 */}
          <motion.strong
            initial={reduced ? false : { opacity: 0, scale: 0.86, rotateX: -72, y: '-0.1em' }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 20 }}
          >
            <AnswerFace answer={answer} size="large" />
          </motion.strong>
          {/* 가운데 정렬이 밀리지 않도록 흐름 밖에 둔다 */}
          <motion.span
            css={bang}
            initial={reduced ? false : { opacity: 0, scale: 0.4, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.14, type: 'spring', stiffness: 520, damping: 22 }}
            aria-hidden
          >
            <AnswerFace answer={answer} size="large" text="!" />
          </motion.span>
        </span>
      </div>
      {!single && <AnswerRow answers={draws} size="small" greeting={false} />}
      <SeriesScore rounds={draws.length} draws={draws} showScore />
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

/** `!`를 오른쪽에 매달아 답 글자가 릴이 멈춘 자리를 지키게 한다 */
const bangAnchor = css({
  position: 'relative',
  display: 'inline-flex',
  alignItems: 'center',
  // 흐름 밖의 `!`까지 포함해 가운데로 보이도록 당긴다
  marginLeft: '-30px',
});

const bang = css({
  position: 'absolute',
  left: '100%',
  top: 0,
});

const glow = css({
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  pointerEvents: 'none',
});

const ring = css({
  position: 'absolute',
  height: '68%',
  aspectRatio: '1',
  borderRadius: '50%',
  borderStyle: 'solid',
  borderWidth: '3px',
  pointerEvents: 'none',
});
