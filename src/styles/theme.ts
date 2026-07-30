/** rgb 채널을 CSS 색으로 */
export function rgb(channels: readonly number[]) {
  return `rgb(${channels[0]},${channels[1]},${channels[2]})`;
}

/** 두 색을 비율만큼 섞는다 */
export function mixShade(from: readonly number[], to: readonly number[], ratio: number) {
  return rgb(from.map((channel, index) => Math.round(channel + (to[index] - channel) * ratio)));
}

/** 입체 글자를 이루는 면 색. 윗면 하이라이트 · 원색 · 두께 순 */
export const answerShade = {
  YES: { light: [124, 180, 255], base: [49, 130, 246], deep: [16, 66, 150] },
  NO: { light: [255, 134, 143], base: [240, 68, 82], deep: [156, 24, 36] },
} as const;

/** TDS Mobile 토큰 */
export const theme = {
  color: {
    background: 'rgb(255,255,255)',
    /** 배지·칩·트랙처럼 눌러 담은 면 */
    fill: 'rgba(7,25,76,0.05)',
    /** 구분선, 그리고 아직 채워지지 않은 표시 */
    border: 'rgba(0,27,55,0.1)',
    /** border보다 한 단계 진한 무채색 */
    strongBorder: 'rgba(0,27,55,0.28)',
    text: 'rgba(0,12,30,0.8)',
    /** 보조 문구 */
    subText: 'rgba(0,19,43,0.58)',
    /** 가장 흐린 문구 */
    faintText: 'rgba(3,24,50,0.46)',
    yes: rgb(answerShade.YES.base),
    no: rgb(answerShade.NO.base),
  },
  space: {
    sm: '8px',
    md: '16px',
    /** 화면 좌우 여백 */
    lg: '24px',
    /** 입력 화면의 섹션 간격 */
    xl: '28px',
  },
  radius: {
    pill: '999px',
  },
  /** 본문 최대 폭 */
  maxWidth: '430px',
} as const;

/** TDS 타이포 스케일 */
export const font = {
  /** 화면·섹션 제목과 CTA */
  title: {
    fontSize: '17px',
    fontWeight: 590,
    lineHeight: 1.252,
    letterSpacing: '-0.01em',
  },
  body: { fontSize: '15px', fontWeight: 510, lineHeight: 1.35 },
  caption: { fontSize: '13px', fontWeight: 510, lineHeight: 1.35 },
} as const;

/** 답변에 대응하는 강조 색 */
export const answerColor = {
  YES: theme.color.yes,
  NO: theme.color.no,
} as const;
