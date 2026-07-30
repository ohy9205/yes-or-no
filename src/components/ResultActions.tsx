import { useState, type CSSProperties } from 'react';
import { Button, FixedBottomCTA, TextButton, useToast } from '@toss/tds-mobile';
import type { DecisionResult } from '../features/decision/result';
import { ctaContainer } from '../styles/cta';
import { vibrate } from '../features/haptic';
import { saveResultImage } from '../features/share/saveResultImage';
import { shareResult } from '../features/share/shareResult';

interface Props {
  result: DecisionResult;
  onRetry: () => void;
}

/** 결과 화면 하단의 다시 하기 / 공유 / 이미지 저장 */
export function ResultActions({ result, onRetry }: Props) {
  const { openToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    setSharing(true);
    try {
      vibrate('tickWeak');
      await shareResult(result);
    } catch {
      openToast('공유할 수 없어요. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSharing(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveResultImage(result);
      openToast('결과 이미지를 저장했어요');
    } catch {
      openToast('이미지를 저장할 수 없어요');
    } finally {
      setSaving(false);
    }
  };

  return (
    <FixedBottomCTA.Double
      containerStyle={ctaContainer}
      leftButton={
        <Button
          color="dark"
          variant="weak"
          style={hugContent}
          loading={saving}
          onClick={handleSave}
        >
          이미지 저장
        </Button>
      }
      rightButton={
        <Button loading={sharing} onClick={handleShare}>
          공유하기
        </Button>
      }
      topAccessory={
        <TextButton size="small" onClick={onRetry}>
          다시 하기
        </TextButton>
      }
    />
  );
}

/* Double CTA는 두 버튼을 반반으로 벌린다. 이미지 저장은 글자 폭만 차지하게 좁힌다 */
const hugContent: CSSProperties = { minWidth: 'auto', flexGrow: 0 };
