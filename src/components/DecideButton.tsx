import { FixedBottomCTA } from '@toss/tds-mobile';
import { ctaContainer } from '../styles/cta';

interface Props {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}

/** 화면 하단에 고정되는 단일 CTA */
export function DecideButton({ label, disabled, onClick }: Props) {
  return (
    <FixedBottomCTA containerStyle={ctaContainer} disabled={disabled} onClick={onClick}>
      {label}
    </FixedBottomCTA>
  );
}
