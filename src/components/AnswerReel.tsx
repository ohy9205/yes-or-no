import { useEffect } from 'react';
import { css } from '@emotion/react';
import { animate, motion, useMotionValue, useTransform, useVelocity } from 'motion/react';
import type { Answer } from '../features/decision/decide';
import { REEL_CELLS, landingIndex } from '../features/decision/reel';
import { stageGlyph, stageLineHeight, type StageSize } from '../styles/stage';
import { answerColor } from '../styles/theme';

interface Props {
  /** 이 릴이 멈출 결과 */
  answer: Answer;
  /** 아직 돌고 있는지 */
  spinning: boolean;
  /** 회전 시간(ms) */
  duration: number;
  size: StageSize;
}

/** 이 속도(칸/초)에 이르면 잔상이 최대가 된다 */
const TOP_SPEED = 25;
/** 멈추기 직전 지나치는 양(칸). 반 칸을 넘으면 다음 글자가 드러난다 */
const OVERSHOOT = 0.35;

/** YES/NO 칸을 세로로 굴리다 결과에서 멈추는 룰렛 하나 */
export function AnswerReel({ answer, spinning, duration, size }: Props) {
  const landing = landingIndex(answer);
  const cellHeight = stageLineHeight(size);

  /** 칸 단위 위치 */
  const position = useMotionValue(spinning ? 0 : landing);
  const speed = useTransform(useVelocity(position), Math.abs);
  const y = useTransform(position, (at) => `${(-at / REEL_CELLS.length) * 100}%`);
  // 빠를수록 세로로 늘어나며 뭉개진다
  const scaleY = useTransform(speed, [0, TOP_SPEED], [1, 1.3], { clamp: true });
  const filter = useTransform(speed, [0, TOP_SPEED], ['blur(0px)', 'blur(6px)'], { clamp: true });

  useEffect(() => {
    // jump은 속도를 남기지 않아 정지 상태에서 잔상이 튀지 않는다
    if (!spinning) {
      position.jump(landing);
      return;
    }
    position.jump(0);
    const controls = animate(position, [0, landing + OVERSHOOT, landing], {
      duration: duration / 1000,
      times: [0, 0.9, 1],
      ease: [[0.08, 0.62, 0.12, 1], 'easeOut'],
    });
    return () => controls.stop();
  }, [duration, landing, position, spinning]);

  return (
    <motion.div
      css={reelWindow}
      style={{ height: cellHeight, scaleY, filter }}
      role="img"
      aria-label={spinning ? '결정하는 중' : answer}
    >
      <motion.div css={strip} style={{ ...stageGlyph(size), y }} aria-hidden>
        {REEL_CELLS.map((face, index) => (
          <span key={index} css={cell} style={{ height: cellHeight, color: answerColor[face] }}>
            {face}
          </span>
        ))}
      </motion.div>
    </motion.div>
  );
}

/** 한 칸만 보여주는 창. 높이가 고정이라 나머지 칸은 잘린다 */
const reelWindow = css({
  // 가장 넓은 칸(YES)에 맞춰야 NO가 가운데 선다
  width: 'fit-content',
  overflow: 'hidden',
  // 위아래로 갈수록 흐려져 원통처럼 보인다
  maskImage: 'linear-gradient(to bottom, transparent, #000 22%, #000 78%, transparent)',
  willChange: 'transform, filter',
});

const strip = css({
  display: 'flex',
  flexDirection: 'column',
});

const cell = css({
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
});
