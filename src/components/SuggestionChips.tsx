import { css } from '@emotion/react';
import { Chip, ChipItem } from '@toss/tds-mobile';
import type { Suggestion } from '../features/decision/suggestions';
import { font, theme } from '../styles/theme';

interface Props {
  items: readonly Suggestion[];
  onSelect: (question: Suggestion) => void;
  /** 추천 질문 묶음을 다시 뽑는다 */
  onReroll: () => void;
}

/** 추천 질문을 칩으로 노출하고, 마음에 드는 게 없으면 다시 뽑게 한다 */
export function SuggestionChips({ items, onSelect, onReroll }: Props) {
  return (
    <div css={container}>
      <div css={chips}>
        <Chip kind="action" margin="none" wrap>
          {items.map((question) => (
            <ChipItem key={question} onClick={() => onSelect(question)}>
              {question}
            </ChipItem>
          ))}
        </Chip>
      </div>
      <button type="button" css={reroll} onClick={onReroll}>
        다른 질문 보기
      </button>
    </div>
  );
}

const container = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '10px',
});

const chips = css({
  padding: `0 ${theme.space.lg}`,
});

const reroll = css({
  ...font.captionBold,
  marginLeft: theme.space.lg,
  padding: `${theme.space.xs} 0`,
  border: 'none',
  backgroundColor: 'transparent',
  fontFamily: 'inherit',
  color: theme.color.subText,
  cursor: 'pointer',
});
