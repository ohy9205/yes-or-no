import { css } from '@emotion/react';
import { SegmentedControl } from '@toss/tds-mobile';
import { tiltText, yesPercent, type Answer, type Tilt } from '../features/decision/decide';
import { font, theme } from '../styles/theme';

interface Props {
  value: Tilt;
  onChange: (tilt: Tilt) => void;
}

/** 기울이지 않음을 나타내는 세그먼트 값 */
const EVEN = 'even';

/** 어느 쪽으로 얼마나 기울일지 고르고, 그 결과를 막대로 보여주는 영역 */
export function TiltPanel({ value, onChange }: Props) {
  const yes = yesPercent(value);

  return (
    <section css={panel}>
      <div css={heading}>
        <span css={title}>확률 기울이기</span>
        <span css={hint}>{tiltText(value) ?? 'YES 50% · NO 50%'}</span>
      </div>
      <SegmentedControl
        value={value ?? EVEN}
        onChange={(next: string) => onChange(next === EVEN ? null : (next as Answer))}
      >
        <SegmentedControl.Item value="NO">NO 쪽</SegmentedControl.Item>
        <SegmentedControl.Item value={EVEN}>반반</SegmentedControl.Item>
        <SegmentedControl.Item value="YES">YES 쪽</SegmentedControl.Item>
      </SegmentedControl>
      {/* 고른 비율을 보여주는 막대. 왼쪽이 NO, 오른쪽이 YES */}
      <div css={bar} aria-hidden>
        <span
          css={share}
          style={{
            width: `${100 - yes}%`,
            // 반반이면 무채색
            backgroundColor: value === null ? theme.color.strongBorder : theme.color.no,
          }}
        />
        <span
          css={share}
          style={{
            width: `${yes}%`,
            backgroundColor: value === null ? theme.color.border : theme.color.yes,
          }}
        />
      </div>
    </section>
  );
}

const panel = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginTop: '15px'
});

const heading = css({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: '12px',
  padding: `0 ${theme.space.lg}`,
});

const title = css({
  ...font.title,
  color: theme.color.text,
});

const hint = css({
  ...font.caption,
  color: theme.color.subText,
});

const bar = css({
  display: 'flex',
  height: '10px',
  margin: `0 ${theme.space.lg}`,
  borderRadius: theme.radius.pill,
  overflow: 'hidden',
  backgroundColor: theme.color.fill,
});

const share = css({
  transition: 'width 220ms ease-out, background-color 220ms ease-out',
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
});
