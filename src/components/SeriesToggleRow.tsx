import { css } from '@emotion/react';
import { font, theme } from '../styles/theme';

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * 삼세번 여부를 켜고 끄는 줄.
 * 스위치가 아니라 줄 전체가 버튼이므로, 스위치는 상태를 비추기만 하는 장식이다.
 */
export function SeriesToggleRow({ checked, onChange }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      css={row}
      onClick={() => onChange(!checked)}
    >
      <span css={texts}>
        <span css={title}>한국인은 삼세번</span>
        <span css={note}>세 번 뽑아 2승이 이겨요</span>
      </span>
      <span css={[track, checked && trackOn]} aria-hidden>
        <span css={[knob, checked && knobOn]} />
      </span>
    </button>
  );
}

const row = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.space.md,
  width: '100%',
  padding: `14px ${theme.space.lg}`,
  border: 'none',
  // 화면 끝까지 그어 앞 섹션과 갈라놓는다
  borderTop: `1px solid ${theme.color.border}`,
  backgroundColor: 'transparent',
  fontFamily: 'inherit',
  color: theme.color.text,
  textAlign: 'left',
  cursor: 'pointer',
});

const texts = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

const title = css(font.title);

const note = css({
  ...font.body,
  color: theme.color.subText,
});

/** TDS Switch — 꺼져 있을 땐 손잡이가 작게 움츠러든다 */
const track = css({
  position: 'relative',
  display: 'block',
  flex: '0 0 auto',
  width: '50px',
  height: '30px',
  borderRadius: theme.radius.pill,
  backgroundColor: theme.color.border,
  transition: 'background-color 180ms ease-out',
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
});

const trackOn = css({
  backgroundColor: theme.color.yes,
});

const knob = css({
  position: 'absolute',
  top: '50%',
  left: '7px',
  width: '16px',
  height: '16px',
  borderRadius: '50%',
  backgroundColor: theme.color.onFill,
  transform: 'translateY(-50%)',
  transition: 'left 180ms cubic-bezier(0.2, 0.9, 0.25, 1), width 180ms, height 180ms',
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
});

const knobOn = css({
  left: '23px',
  width: '24px',
  height: '24px',
});
