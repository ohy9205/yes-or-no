import { useState } from 'react';
import { css } from '@emotion/react';
import { Button, FixedBottomCTA, useToast } from '@toss/tds-mobile';
import type { DecisionResult } from '../features/decision/result';
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
      leftButton={
        <Button color="light" display="block" loading={saving} onClick={handleSave}>
          이미지 저장
        </Button>
      }
      rightButton={
        <Button display="block" loading={sharing} onClick={handleShare}>
          공유하기
        </Button>
      }
      topAccessory={
        <button type="button" css={retry} onClick={onRetry}>
          다시 하기
        </button>
      }
    />
  );
}

/* 버튼 기본 겉모습만 지우고 글꼴·색은 슬롯에서 물려받는다 */
const retry = css({
  padding: 0,
  border: 'none',
  backgroundColor: 'transparent',
  font: 'inherit',
  color: 'inherit',
  cursor: 'pointer',
});
