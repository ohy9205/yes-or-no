import { Storage } from '@apps-in-toss/web-framework';
import {
  DEFAULT_OPTIONS,
  normalizeOptions,
  type DecisionOptions,
} from '../decision/options';

const KEY = 'decision-options';

/**
 * 마지막으로 고른 결정 옵션을 불러온다.
 * 토스 앱 밖(브라우저 개발 중)이나 저장소 오류, 깨진 값이면 기본 옵션을 돌려준다.
 */
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
    // 저장 실패가 결정 흐름을 막아서는 안 된다
  }
}
