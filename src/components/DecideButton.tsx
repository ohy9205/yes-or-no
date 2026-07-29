import { FixedBottomCTA } from '@toss/tds-mobile';

interface Props {
  label: string;
  onClick: () => void;
}

/** 화면 하단에 고정되는 단일 CTA */
export function DecideButton({ label, onClick }: Props) {
  return <FixedBottomCTA onClick={onClick}>{label}</FixedBottomCTA>;
}
