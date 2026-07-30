import { Storage } from '@apps-in-toss/web-framework';
import {
  DEFAULT_OPTIONS,
  normalizeOptions,
  type DecisionOptions,
} from '../decision/options';

const KEY = 'decision-options';

/** 마지막으로 고른 결정 옵션을 불러온다. 없거나 깨진 값이면 기본 옵션 */
export async function loadDecisionOptions(): Promise<DecisionOptions> {
  try {
    const raw = await Storage.getItem(KEY);
    if (raw == null) return DEFAULT_OPTIONS;
    return normalizeOptions(JSON.parse(raw));
  } catch {
    return DEFAULT_OPTIONS;
  }
}

/** 옵션 1벌만 덮어써 저장한다 */
export async function saveDecisionOptions(options: DecisionOptions): Promise<void> {
  try {
    await Storage.setItem(KEY, JSON.stringify(options));
  } catch {
    // 저장 실패는 무시
  }
}
