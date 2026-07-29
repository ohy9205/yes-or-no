import { useId, type KeyboardEvent } from 'react';
import { css } from '@emotion/react';
import { font, theme } from '../styles/theme';

interface Props {
  value: string;
  onChange: (value: string) => void;
  /** 키보드에서 확인을 눌렀을 때 */
  onSubmit: () => void;
}

/** 질문을 입력받는 상단 필드. 입력한 질문 자체가 화면의 제목 역할을 한다 */
export function QuestionInput({ value, onChange, onSubmit }: Props) {
  const id = useId();

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // 한글 조합 중의 Enter는 글자를 확정하는 입력이므로 결정으로 받지 않는다
    if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;
    e.currentTarget.blur();
    onSubmit();
  };

  return (
    <div css={field}>
      <label css={label} htmlFor={id}>
        무엇이 고민이신가요?
      </label>
      <input
        css={input}
        id={id}
        type="text"
        value={value}
        placeholder="치킨 먹을까?"
        maxLength={40}
        enterKeyHint="go"
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {/* TDS Text Field / Variant=Line — 밑줄만으로 입력 중임을 알린다 */}
      <span css={underline} aria-hidden />
    </div>
  );
}

const field = css({
  display: 'flex',
  flexDirection: 'column',
  padding: `${theme.space.md} ${theme.space.lg}`,
});

const label = css({
  ...font.caption,
  color: theme.color.text,
});

const input = css({
  ...font.display,
  width: '100%',
  height: '41px',
  boxSizing: 'border-box',
  margin: '6px 0 4px',
  padding: 0,
  border: 'none',
  outline: 'none',
  backgroundColor: 'transparent',
  fontFamily: 'inherit',
  color: theme.color.text,
  '&::placeholder': {
    color: theme.color.faintText,
  },
});

const underline = css({
  height: '2px',
  backgroundColor: theme.color.border,
  transition: 'background-color 150ms ease-out',
  'input:focus ~ &': {
    backgroundColor: theme.color.yes,
  },
  '@media (prefers-reduced-motion: reduce)': {
    transition: 'none',
  },
});
