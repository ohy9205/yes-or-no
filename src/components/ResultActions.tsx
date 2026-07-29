import { useState } from 'react';
import { css } from '@emotion/react';
import { Button, FixedBottomCTA, useToast } from '@toss/tds-mobile';
import type { DecisionResult } from '../features/decision/result';
import { vibrate } from '../features/haptic';
import { saveResultImage } from '../features/share/saveResultImage';
import { shareResult } from '../features/share/shareResult';
import { font, theme } from '../styles/theme';

interface Props {
  result: DecisionResult;
  onRetry: () => void;
}

/** 결과 화면 하단의 다시 하기 / 공유 / 이미지 저장 */
export function ResultActions({ result, onRetry }: Props) {
  const { openToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);

  // 공유·저장은 구버전 앱이나 권한 거부로 실패할 수 있다.
  // 실패해도 토스트만 띄우고 화면은 그대로 쓸 수 있어야 한다.
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
      // 다시 하기는 결과를 지우는 행동이라 공유·저장보다 한 단계 물러나 있어야 한다.
      // CTA 위에 놓아 실수로 눌리는 자리를 피한다
      topAccessory={
        <div css={retryRow}>
          <button type="button" css={retry} onClick={onRetry}>
            다시 하기
          </button>
        </div>
      }
    />
  );
}

const retryRow = css({
  display: 'flex',
  justifyContent: 'center',
  padding: `0 ${theme.space.lg} 26px`,
});

const retry = css({
  ...font.bodyBold,
  padding: 0,
  border: 'none',
  backgroundColor: 'transparent',
  fontFamily: 'inherit',
  color: theme.color.subText,
  cursor: 'pointer',
});
