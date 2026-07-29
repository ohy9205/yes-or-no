import { getTossShareLink, share } from '@apps-in-toss/web-framework';
import type { Answer } from '../decision/decide';

/** granite.config.ts의 appName과 반드시 일치해야 한다 */
const APP_NAME = 'yes-or-no';
const DEEP_LINK = `intoss://${APP_NAME}`;

/** 공유 메시지 본문. 딥링크는 생성에 실패하면 빼고 보낸다 */
export function buildShareMessage(question: string, answer: Answer, link?: string): string {
  return [question, answer, link].filter(Boolean).join('\n\n');
}

/**
 * 결과를 텍스트로 공유한다 (이미지 공유는 SDK 미지원).
 * 딥링크 생성이 실패해도 메시지만으로 공유는 이어간다.
 */
export async function shareResult(question: string, answer: Answer): Promise<void> {
  let link: string | undefined;
  try {
    link = await getTossShareLink(DEEP_LINK);
  } catch {
    // 링크 없이 텍스트만 공유
  }

  await share({ message: buildShareMessage(question, answer, link) });
}
