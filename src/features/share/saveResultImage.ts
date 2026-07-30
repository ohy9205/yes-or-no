import { saveBase64Data } from '@apps-in-toss/web-framework';
import type { DecisionResult } from '../decision/result';
import { renderResultCard } from './renderResultCard';

const DATA_URL_PREFIX = /^data:[^;]+;base64,/;

/** 결과 카드를 그려 사용자 기기에 PNG로 저장한다. 실패는 호출부에서 처리한다 */
export async function saveResultImage(result: DecisionResult): Promise<void> {
  const dataUrl = renderResultCard(result);
  // saveBase64Data는 순수 base64만 받는다
  const data = dataUrl.replace(DATA_URL_PREFIX, '');

  await saveBase64Data({
    data,
    fileName: `yesno-${Date.now()}.png`,
    mimeType: 'image/png',
  });
}
