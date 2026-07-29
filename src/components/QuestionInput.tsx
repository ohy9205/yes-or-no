import { TextField } from '@toss/tds-mobile';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

/** 질문을 입력받는 상단 필드 */
export function QuestionInput({ value, onChange }: Props) {
  return (
    <TextField
      variant="box"
      label="무엇이 고민이신가요?"
      labelOption="sustain"
      placeholder="오늘 치킨 먹을까?"
      value={value}
      maxLength={40}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
