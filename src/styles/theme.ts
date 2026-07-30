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
    yes: 'rgb(49,130,246)',
    no: 'rgb(240,68,82)',
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
  bodyBold: { fontSize: '15px', fontWeight: 590, lineHeight: 1.35 },
  caption: { fontSize: '13px', fontWeight: 510, lineHeight: 1.35 },
  captionBold: { fontSize: '13px', fontWeight: 590, lineHeight: 1.35 },
} as const;

/** 답변에 대응하는 강조 색 */
export const answerColor = {
  YES: theme.color.yes,
  NO: theme.color.no,
} as const;
