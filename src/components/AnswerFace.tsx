import type { Answer } from '../features/decision/decide';
import { extrudeLayers, frontStops } from '../styles/extrude';
import type { StageSize } from '../styles/stage';
import { GlyphText } from './GlyphText';

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
    <GlyphText size={size} fill={frontStops(answer)} layers={extrudeLayers(answer)}>
      {text}
    </GlyphText>
  );
}
