import { css } from '@emotion/react';
import type { Answer } from '../features/decision/decide';
import { extrudeShadow, frontFill } from '../styles/extrude';
import { stageGlyph, type StageSize } from '../styles/stage';

interface Props {
  /** 색을 정하는 답 */
  answer: Answer;
  size: StageSize;
  /** 그릴 글자. 기본은 답 그대로 */
  text?: string;
}

/** 두께 겹 위에 그라데이션 앞면을 덮어 세운 입체 글자 */
export function AnswerFace({ answer, size, text = answer }: Props) {
  return (
    <span css={face} style={stageGlyph(size)}>
      <span css={depth} style={{ textShadow: extrudeShadow(answer) }} aria-hidden>
        {text}
      </span>
      <span css={front} style={frontFill(answer)}>
        {text}
      </span>
    </span>
  );
}

const face = css({
  position: 'relative',
  display: 'inline-block',
});

/** 두께는 흐름 밖에서 그려 앞면이 자리를 정하게 한다 */
const depth = css({
  position: 'absolute',
  left: 0,
  top: 0,
  color: 'transparent',
});

const front = css({
  position: 'relative',
});
