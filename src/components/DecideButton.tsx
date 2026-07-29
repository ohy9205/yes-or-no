import { FixedBottomCTA } from '@toss/tds-mobile';

interface Props {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}

/** 화면 하단에 고정되는 단일 CTA */
export function DecideButton({ label, disabled, onClick }: Props) {
  return (
    <FixedBottomCTA disabled={disabled} onClick={onClick}>
      {label}
    </FixedBottomCTA>
  );
}
