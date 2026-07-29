import { saveBase64Data } from '@apps-in-toss/web-framework';
import type { DecisionResult } from '../decision/result';
import { renderResultCard } from './renderResultCard';

const DATA_URL_PREFIX = /^data:[^;]+;base64,/;

/**
 * 결과 카드를 그려 사용자 기기에 PNG로 저장한다.
 * 구버전 토스 앱이나 권한 거부 시 실패할 수 있으므로 호출부에서 반드시 실패를 처리해야 한다.
 */
export async function saveResultImage(result: DecisionResult): Promise<void> {
  const dataUrl = renderResultCard(result);
  // saveBase64Data는 순수 base64만 받으므로 data URL 프리픽스를 잘라낸다
  const data = dataUrl.replace(DATA_URL_PREFIX, '');

  await saveBase64Data({
    data,
    fileName: `yesno-${Date.now()}.png`,
    mimeType: 'image/png',
  });
}
