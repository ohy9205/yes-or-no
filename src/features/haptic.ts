import { generateHapticFeedback, type HapticFeedbackType } from '@apps-in-toss/web-framework';

/** 햅틱 진동. 미지원 환경에서는 조용히 무시한다 */
export function vibrate(type: HapticFeedbackType) {
  try {
    void generateHapticFeedback({ type }).catch(() => {});
  } catch {
    // noop
  }
}
