import { Storage } from '@apps-in-toss/web-framework';

const KEY = 'recent-question';

/**
 * 마지막으로 물어본 질문을 불러온다.
 * 토스 앱 밖(브라우저 개발 중)이나 저장소 오류 시 빈 문자열을 돌려준다.
 */
export async function loadRecentQuestion(): Promise<string> {
  try {
    return (await Storage.getItem(KEY)) ?? '';
  } catch {
    return '';
  }
}

/** 마지막 질문 1개만 덮어써 저장한다 */
export async function saveRecentQuestion(question: string): Promise<void> {
  try {
    await Storage.setItem(KEY, question);
  } catch {
    // 저장 실패가 결정 흐름을 막아서는 안 된다
  }
}
