import { generateHapticFeedback, type HapticFeedbackType } from '@apps-in-toss/web-framework';

/**
 * 햅틱 진동. 토스 앱 밖(브라우저 개발 중)이나 미지원 기기에서는 조용히 무시한다.
 * 연출용 부가 효과이므로 실패가 흐름을 막아서는 안 된다.
 */
export function vibrate(type: HapticFeedbackType) {
  try {
    void generateHapticFeedback({ type }).catch(() => {});
  } catch {
    // noop
  }
}
