import { Chip, ChipItem } from '@toss/tds-mobile';
import type { Suggestion } from '../features/decision/suggestions';

interface Props {
  items: readonly Suggestion[];
  onSelect: (question: Suggestion) => void;
}

/** 추천 질문을 칩으로 노출하고 선택을 전달 */
export function SuggestionChips({ items, onSelect }: Props) {
  return (
    <Chip kind="action" margin="none" wrap>
      {items.map((question) => (
        <ChipItem key={question} onClick={() => onSelect(question)}>
          {question}
        </ChipItem>
      ))}
    </Chip>
  );
}
