import { css } from '@emotion/react';
import { tiltText, type Tilt } from '../features/decision/decide';
import { font, theme } from '../styles/theme';
import { Badge } from '@toss/tds-mobile';

interface Props {
  tilt: Tilt;
}

/** 모든 단계에 남아 있는 상단 줄. 기울임 상태를 배지로 보여준다 */
export function AppHeader({ tilt }: Props) {
  const notice = tiltText(tilt);

  return (
    <header css={bar}>
      <h1 css={brand}>YES / NO</h1>
      {notice !== null && <Badge color='elephant' size='large' variant='weak'>{notice}</Badge>}
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
