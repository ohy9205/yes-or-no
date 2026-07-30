import { useId } from 'react';
import { css } from '@emotion/react';
import type { ExtrudeLayer, FrontStop } from '../styles/extrude';
import {
  GLYPH_ROUND,
  STAGE_LINE_HEIGHT,
  STAGE_TRACKING,
  stageGlyph,
  type StageSize,
} from '../styles/stage';

interface Props {
  children: string;
  size: StageSize;
  /** 앞면 채움. 단색이면 색, 그라데이션이면 정지점 */
  fill: string | FrontStop[];
  /** 글자 뒤에 깔 두께 겹. 가까운 겹부터 */
  layers?: ExtrudeLayer[];
}

/** 모서리를 둥글게 깎은 글자. 두께 겹을 함께 쌓을 수 있다 */
export function GlyphText({ children, size, fill, layers = [] }: Props) {
  const gradientId = useId();
  const front = typeof fill === 'string' ? fill : `url(#${gradientId})`;

  return (
    <span css={box} style={stageGlyph(size)}>
      {/* 글자 크기대로 자리를 잡는 본문. 실제 그림은 이 자리를 덮는 SVG가 그린다 */}
      <span css={sizer}>{children}</span>
      <svg css={canvas} aria-hidden>
        {typeof fill !== 'string' && (
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              {fill.map(({ at, color }) => (
                <stop key={at} offset={at} stopColor={color} />
              ))}
            </linearGradient>
          </defs>
        )}
        {[...layers].reverse().map(({ offset, color }) => (
          <Glyph key={offset} paint={color} offset={offset}>
            {children}
          </Glyph>
        ))}
        <Glyph paint={front}>{children}</Glyph>
      </svg>
    </span>
  );
}

interface GlyphProps {
  children: string;
  paint: string;
  /** 글자 크기 대비 오프셋 */
  offset?: number;
}

/** 둥근 획을 글자 겉에 둘러 모서리를 깎는다 */
function Glyph({ children, paint, offset = 0 }: GlyphProps) {
  return (
    <text
      css={glyph}
      x={0}
      y="50%"
      fill={paint}
      stroke={paint}
      style={offset === 0 ? undefined : { transform: `translate(${offset}em, ${offset}em)` }}
    >
      {children}
    </text>
  );
}

/** 글자 한 줄 높이로 못 박는다. 이 높이가 흔들리면 SVG 글자의 기준선이 어긋난다 */
const box = css({
  position: 'relative',
  display: 'inline-block',
  height: `${STAGE_LINE_HEIGHT}em`,
});

/** 마지막 글자 뒤에 붙는 자간을 덜어내 상자가 글자에 딱 맞는다 */
const sizer = css({
  marginRight: `-${STAGE_TRACKING}em`,
  whiteSpace: 'nowrap',
  color: 'transparent',
});

const canvas = css({
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  // 외곽선과 두께 겹은 글자 상자 밖까지 번진다
  overflow: 'visible',
  pointerEvents: 'none',
});

const glyph = css({
  // 본문 글자와 같은 높이에 앉도록 글자 상자의 세로 중앙에 기준선을 맞춘다
  dominantBaseline: 'central',
  strokeWidth: `${GLYPH_ROUND}em`,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
  paintOrder: 'stroke',
});
