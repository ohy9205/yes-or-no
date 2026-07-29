import { useCallback, useEffect, useRef, useState } from 'react';
import { vibrate } from '../haptic';
import { decide, type Answer } from './decide';

export type Phase = 'idle' | 'rolling' | 'teasing' | 'revealed';

/** 각 연출 단계의 지속 시간(ms). 총 대기 1.3초 */
export const PHASE_MS = {
  rolling: 700,
  teasing: 600,
} as const;

const TEASING_AT = PHASE_MS.rolling;
const REVEALED_AT = PHASE_MS.rolling + PHASE_MS.teasing;

/** 연출 시작 후 경과 시간에 해당하는 단계 */
export function phaseAt(elapsed: number): Exclude<Phase, 'idle'> {
  if (elapsed < TEASING_AT) return 'rolling';
  if (elapsed < REVEALED_AT) return 'teasing';
  return 'revealed';
}

function prefersReducedMotion() {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * idle → rolling → teasing → revealed 연출 상태머신.
 *
 * 결과는 `start()` 시점에 확정해두고 이후로는 연출만 재생하므로,
 * 연출 도중 백그라운드 전환이나 리렌더가 일어나도 답이 바뀌지 않는다.
 */
export function usePhase() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [answer, setAnswer] = useState<Answer | null>(null);
  /** 연출 시작 시각. 0이면 재생 중이 아니라는 뜻 */
  const startedAt = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  // 경과 시간으로 단계를 계산해 다음 전환을 예약한다.
  // 백그라운드에서 타이머가 밀려도 복귀 시 밀린 만큼 따라잡는다.
  const sync = useCallback(function tick() {
    if (startedAt.current === 0) return;

    clearTimeout(timer.current);
    const elapsed = Date.now() - startedAt.current;
    const next = phaseAt(elapsed);
    setPhase(next);

    if (next === 'revealed') {
      startedAt.current = 0;
      vibrate('basicMedium');
      return;
    }
    const nextAt = next === 'rolling' ? TEASING_AT : REVEALED_AT;
    timer.current = setTimeout(tick, nextAt - elapsed);
  }, []);

  const start = useCallback(() => {
    clearTimeout(timer.current);
    setAnswer(decide());
    vibrate('tickWeak');

    // 모션을 줄이는 설정이면 연출을 건너뛰고 바로 결과를 보여준다
    if (prefersReducedMotion()) {
      startedAt.current = 0;
      setPhase('revealed');
      vibrate('basicMedium');
      return;
    }
    startedAt.current = Date.now();
    sync();
  }, [sync]);

  const reset = useCallback(() => {
    clearTimeout(timer.current);
    startedAt.current = 0;
    setAnswer(null);
    setPhase('idle');
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') sync();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(timer.current);
    };
  }, [sync]);

  return { phase, answer, start, reset };
}
