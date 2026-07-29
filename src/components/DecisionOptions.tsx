import { css } from '@emotion/react';
import type { Tilt } from '../features/decision/decide';
import type { DecisionOptions as Options } from '../features/decision/options';
import { theme } from '../styles/theme';
import { SeriesToggleRow } from './SeriesToggleRow';
import { TiltPanel } from './TiltPanel';

interface Props {
  value: Options;
  onChange: (options: Options) => void;
}

/** 추첨 방식을 고르는 idle 화면의 옵션 영역 */
export function DecisionOptions({ value, onChange }: Props) {
  const handleTilt = (tilt: Tilt) => onChange({ ...value, tilt });
  const handleBestOfThree = (bestOfThree: boolean) => onChange({ ...value, bestOfThree });

  return (
    <div css={panel}>
      <TiltPanel value={value.tilt} onChange={handleTilt} />
      <SeriesToggleRow checked={value.bestOfThree} onChange={handleBestOfThree} />
    </div>
  );
}

const panel = css({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.xl,
});
