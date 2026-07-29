export type Answer = 'YES' | 'NO';

/** 균등한 50:50 추첨 */
export function decide(): Answer {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % 2 === 0 ? 'YES' : 'NO';
}
