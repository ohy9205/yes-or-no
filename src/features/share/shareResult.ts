import { getTossShareLink, share } from '@apps-in-toss/web-framework';
import { opposite, tiltText } from '../decision/decide';
import type { DecisionResult } from '../decision/result';
import { tally } from '../decision/series';

/** apps-in-toss.config.ts의 appName과 반드시 일치해야 한다 */
const APP_NAME = 'yes-or-no';
const DEEP_LINK = `intoss://${APP_NAME}`;

/** 공유 메시지 본문. 딥링크는 생성에 실패하면 빼고 보낸다 */
export function buildShareMessage(result: DecisionResult, link?: string): string {
  const { question, answer, draws, tilt } = result;
  const counts = tally(draws);
  const headline =
    draws.length > 1 ? `${answer} (삼세번 ${counts[answer]}:${counts[opposite(answer)]})` : answer;

  const body = [headline, tiltText(tilt)].filter(Boolean).join('\n');
  return [question, body, link].filter(Boolean).join('\n\n');
}

/** 결과를 텍스트로 공유한다 (이미지 공유는 SDK 미지원) */
export async function shareResult(result: DecisionResult): Promise<void> {
  let link: string | undefined;
  try {
    link = await getTossShareLink(DEEP_LINK);
  } catch {
    // 링크 없이 텍스트만 공유
  }

  await share({ message: buildShareMessage(result, link) });
}
