import { css } from '@emotion/react';
import { tiltText, type Tilt } from '../features/decision/decide';
import { font, theme } from '../styles/theme';

interface Props {
  tilt: Tilt;
}

/**
 * 모든 단계에 걸쳐 남아 있는 상단 줄.
 * 기울여둔 상태는 입력 화면을 벗어난 뒤에도 배지로 계속 보인다.
 */
export function AppHeader({ tilt }: Props) {
  const notice = tiltText(tilt);

  return (
    <header css={bar}>
      <h1 css={brand}>YES / NO</h1>
      {notice !== null && <span css={badge}>{notice}</span>}
    </header>
  );
}

const bar = css({
  display: 'flex',
  flex: '0 0 auto',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.space.sm,
  height: '56px',
  padding: `0 20px 0 ${theme.space.lg}`,
});

const brand = css({
  ...font.title,
  margin: 0,
  color: theme.color.text,
});

const badge = css({
  ...font.bodyBold,
  display: 'inline-flex',
  flex: '0 0 auto',
  alignItems: 'center',
  height: '32px',
  padding: '2px 13px',
  borderRadius: theme.radius.pill,
  backgroundColor: theme.color.fill,
  boxShadow: theme.shadow.chip,
  color: theme.color.subText,
  whiteSpace: 'nowrap',
});
