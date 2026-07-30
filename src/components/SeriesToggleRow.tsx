import type { KeyboardEvent } from 'react';
import { css } from '@emotion/react';
import { Border, Switch } from '@toss/tds-mobile';
import { font, theme } from '../styles/theme';

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** 삼세번 여부를 켜고 끄는 줄. 스위치가 아니라 줄 전체를 누른다 */
export function SeriesToggleRow({ checked, onChange }: Props) {
  const toggle = () => onChange(!checked);

  // Space·Enter로도 토글
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== ' ' && e.key !== 'Enter') return;
    e.preventDefault();
    toggle();
  };

  return (
    <div>
      <Border variant="full" />
      <div
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        css={row}
        onClick={toggle}
        onKeyDown={handleKeyDown}
      >
        <span css={texts}>
          <span css={title}>한국인은 삼세번</span>
          <span css={note}>세 번 뽑아 2승이 이겨요</span>
        </span>
        {/* 클릭은 줄 전체가 받는다. 스위치가 받으면 토글이 두 번 울린다 */}
        <span css={switchSlot} aria-hidden>
          <Switch checked={checked} tabIndex={-1} />
        </span>
      </div>
    </div>
  );
}

const row = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.space.md,
  padding: `14px ${theme.space.lg}`,
  color: theme.color.text,
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

const switchSlot = css({
  display: 'flex',
  flex: '0 0 auto',
  pointerEvents: 'none',
});
