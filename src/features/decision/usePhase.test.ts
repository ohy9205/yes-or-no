import { describe, expect, it } from 'vitest';
import { PHASE_MS, phaseAt } from './usePhase';

const TOTAL = PHASE_MS.rolling + PHASE_MS.teasing;

describe('phaseAt', () => {
  it('경과 시간에 따라 rolling → teasing → revealed 순으로 넘어간다', () => {
    expect(phaseAt(0)).toBe('rolling');
    expect(phaseAt(PHASE_MS.rolling - 1)).toBe('rolling');
    expect(phaseAt(PHASE_MS.rolling)).toBe('teasing');
    expect(phaseAt(TOTAL - 1)).toBe('teasing');
    expect(phaseAt(TOTAL)).toBe('revealed');
  });

  it('백그라운드 복귀처럼 시간이 크게 밀려도 revealed에 머문다', () => {
    expect(phaseAt(TOTAL * 100)).toBe('revealed');
  });

  it('총 연출 시간이 1.3초를 넘지 않는다', () => {
    expect(TOTAL).toBeLessThanOrEqual(1_300);
  });
});
