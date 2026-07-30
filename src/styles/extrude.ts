import type { CSSProperties } from 'react';
import type { Answer } from '../features/decision/decide';
import { answerShade, mixShade, rgb } from './theme';

/** 두께를 이루는 겹 수 */
const LAYERS = 9;
/** 겹 하나가 밀리는 거리. 글자 크기 대비 비율이라 크기가 줄어도 비례를 지킨다 */
const STEP = 0.012;

export interface ExtrudeLayer {
  /** 글자 크기 대비 오프셋 */
  offset: number;
  color: string;
}

/** 글자 뒤로 쌓이는 두께 겹. 가까운 겹부터 */
export function extrudeLayers(answer: Answer): ExtrudeLayer[] {
  const { base, deep } = answerShade[answer];
  return Array.from({ length: LAYERS }, (_, index) => ({
    offset: STEP * (index + 1),
    color: mixShade(base, deep, 0.4 + (0.6 * index) / (LAYERS - 1)),
  }));
}

/** 겹을 그림자로 쌓아 레이아웃을 건드리지 않고 두께를 만든다 */
export function extrudeShadow(answer: Answer): string {
  return extrudeLayers(answer)
    .map(({ offset, color }) => `${offset}em ${offset}em 0 ${color}`)
    .join(', ');
}

export interface FrontStop {
  /** 글자 위에서 아래로의 위치 */
  at: number;
  color: string;
}

/** 앞면 그라데이션 */
export function frontStops(answer: Answer): FrontStop[] {
  const { light, base, deep } = answerShade[answer];
  return [
    { at: 0, color: rgb(light) },
    { at: 0.58, color: rgb(base) },
    { at: 1, color: mixShade(base, deep, 0.3) },
  ];
}

/** 그라데이션을 글자 모양으로 오려낸 앞면 */
export function frontFill(answer: Answer): CSSProperties {
  const stops = frontStops(answer)
    .map(({ at, color }) => `${color} ${at * 100}%`)
    .join(', ');
  return {
    backgroundImage: `linear-gradient(180deg, ${stops})`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  };
}
