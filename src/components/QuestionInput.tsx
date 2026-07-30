import type { KeyboardEvent } from 'react';
import { TextField } from '@toss/tds-mobile';

interface Props {
  value: string;
  onChange: (value: string) => void;
  /** 키보드에서 확인을 눌렀을 때 */
  onSubmit: () => void;
}

const LABEL = '무엇이 고민이신가요?';

/** 질문을 입력받는 상단 필드. 입력한 질문 자체가 화면의 제목 역할을 한다 */
export function QuestionInput({ value, onChange, onSubmit }: Props) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // 한글 조합 중 Enter는 무시
    if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;
    e.currentTarget.blur();
    onSubmit();
  };

  return (
    <TextField
      variant="box"
      label={LABEL}
      // 값이 있어도 label을 유지한다
      labelOption="sustain"
      // label이 input과 연결되지 않아 이름을 따로 준다
      aria-label={LABEL}
      value={value}
      placeholder="치킨 먹을까?"
      maxLength={40}
      enterKeyHint="go"
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      paddingBottom={0}
    />
  );
}
