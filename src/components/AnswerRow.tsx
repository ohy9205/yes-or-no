import { css } from '@emotion/react';
import { motion } from 'motion/react';
import type { Answer } from '../features/decision/decide';
import type { StageSize } from '../styles/stage';
import { theme } from '../styles/theme';
import { AnswerReel } from './AnswerReel';

interface Props {
  /** 세워둔 판. 마지막 칸이 돌고 있을 수 있다 */
  answers: Answer[];
  /** 마지막 릴이 아직 돌고 있는지 */
  spinning?: boolean;
  /** 회전 시간(ms) */
  duration?: number;
  size: StageSize;
  /** 새로 들어온 릴을 튀어나오게 할지. 결과 화면은 연출 화면에서 이어받기만 한다 */
  greeting?: boolean;
}

/**
 * 릴을 한 줄에 나란히 세운다. 판이 늘면 기존 릴이 바깥으로 밀린다.
 * layoutId가 연출 화면과 결과 화면을 이어 붙여, 화면이 바뀌어도 릴이 제자리에서 움직인다.
 */
export function AnswerRow({ answers, spinning = false, duration = 0, size, greeting = true }: Props) {
  const last = answers.length - 1;

  return (
    <div css={row}>
      {answers.map((answer, index) => (
        // 자리 이동과 등장을 다른 엘리먼트가 맡는다. 한 곳에 layout과 scale을 같이 걸면 서로 밀어낸다
        <motion.div
          key={index}
          layout
          layoutId={`reel-${index}`}
          transition={{ type: 'spring', stiffness: 380, damping: 34 }}
        >
          <motion.div
            initial={greeting ? { opacity: 0, scale: 0.4 } : false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 460, damping: 30 }}
          >
            <AnswerReel
              answer={answer}
              spinning={spinning && index === last}
              duration={duration}
              size={size}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

const row = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.space.sm,
});
