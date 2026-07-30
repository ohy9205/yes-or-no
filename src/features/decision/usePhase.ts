import { useCallback, useEffect, useRef, useState } from 'react';
import { vibrate } from '../haptic';
import { decide, type Answer } from './decide';
import { DEFAULT_OPTIONS, type DecisionOptions } from './options';
import { drawSeries, winner } from './series';
import { buildTimeline, frameAt, revealedCount, type Segment, type StagePhase } from './timeline';

export type Phase = 'idle' | StagePhase;

const IDLE: Segment = { phase: 'spinning', round: 0, endsAt: 0 };

function prefersReducedMotion() {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * idle → spinning → (roundResult →) revealed 연출 상태머신.
 * 판 목록은 `start()` 시점에 전부 확정하고 이후로는 연출만 재생한다.
 * 아직 연출되지 않은 판은 밖으로 내보내지 않는다.
 */
export function usePhase() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [segment, setSegment] = useState<Segment>(IDLE);
  const series = useRef<Answer[]>([]);
  const timeline = useRef<Segment[]>([]);
  /** 연출 시작 시각. 0이면 재생 중이 아니라는 뜻 */
  const startedAt = useRef(0);
  /** 햅틱을 이미 울린 단계 */
  const played = useRef<Phase>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>();

  // 경과 시간으로 구간을 계산해 다음 전환을 예약한다
  const sync = useCallback(function tick() {
    if (startedAt.current === 0) return;

    clearTimeout(timer.current);
    const elapsed = Date.now() - startedAt.current;
    const next = frameAt(elapsed, timeline.current);
    // 같은 단계에서 햅틱을 두 번 울리지 않는다
    if (played.current !== next.phase) {
      if (next.phase === 'revealed') vibrate('basicMedium');
      else if (next.phase === 'roundResult') vibrate('tickMedium');
      played.current = next.phase;
    }
    setPhase(next.phase);
    setSegment(next);

    if (next.phase === 'revealed') {
      startedAt.current = 0;
      return;
    }
    timer.current = setTimeout(tick, next.endsAt - elapsed);
  }, []);

  const start = useCallback(
    (options: DecisionOptions = DEFAULT_OPTIONS) => {
      clearTimeout(timer.current);
      series.current = options.bestOfThree ? drawSeries(options.tilt) : [decide(options.tilt)];
      timeline.current = buildTimeline(series.current.length);
      played.current = 'idle';
      vibrate('tickWeak');

      // 모션을 줄이는 설정이면 연출을 건너뛰고 결과를 바로 보여준다
      if (prefersReducedMotion()) {
        startedAt.current = 0;
        setPhase('revealed');
        setSegment(timeline.current[timeline.current.length - 1]);
        vibrate('basicMedium');
        return;
      }
      startedAt.current = Date.now();
      sync();
    },
    [sync],
  );

  const reset = useCallback(() => {
    clearTimeout(timer.current);
    startedAt.current = 0;
    series.current = [];
    timeline.current = [];
    setSegment(IDLE);
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

  return {
    phase,
    /** 지금까지 공개된 판 */
    draws: series.current.slice(0, revealedCount(segment, series.current.length)),
    /** 화면에 세워둔 릴. 마지막 칸이 지금 돌고 있는 판이다 */
    reels: series.current.slice(0, segment.round + 1),
    /** 총 판 수. idle이면 0 */
    rounds: series.current.length,
    answer: phase === 'revealed' ? winner(series.current) : null,
    start,
    reset,
  };
}
