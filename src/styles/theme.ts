/**
 * TDS Mobile 토큰. 값은 디자인(`YES NO 미니앱 v3 TDS`)이 참조한 .fig에서 그대로 옮겼다.
 * 색이 전부 반투명인 건 TDS의 adaptive 계열이라 그렇다 — 배경 위에 겹쳐 쓰는 걸 전제로 한다.
 */
export const theme = {
  color: {
    background: 'rgb(255,255,255)',
    /** 배지·칩·트랙처럼 눌러 담은 면 */
    fill: 'rgba(7,25,76,0.05)',
    /** 구분선, 그리고 아직 채워지지 않은 표시 */
    border: 'rgba(0,27,55,0.1)',
    text: 'rgba(0,12,30,0.8)',
    /** 본문보다 한 단계 흐린 보조 문구 */
    subText: 'rgba(0,19,43,0.58)',
    /** 가장 흐린 문구. 면책·연출 중 안내처럼 눈에 띌 필요 없는 곳에만 */
    faintText: 'rgba(3,24,50,0.46)',
    yes: 'rgb(49,130,246)',
    no: 'rgb(240,68,82)',
    /** 채워진 면 위에 얹는 글자 */
    onFill: 'rgb(255,255,255)',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    /** 화면 좌우 여백 */
    lg: '24px',
    /** 입력 화면에서 섹션끼리 벌어지는 간격 */
    xl: '28px',
  },
  radius: {
    /** 완전한 알약 */
    pill: '999px',
  },
  shadow: {
    /** 칩·배지 가장자리를 아주 옅게 잡아주는 안쪽 테두리 */
    chip: 'inset 0 0 0 0.66px rgba(0,23,51,0.02)',
  },
  /** 화면이 넓어져도 한 손에 들어오는 폭을 유지한다 */
  maxWidth: '430px',
} as const;

/**
 * TDS 타이포 스케일.
 * 크기·굵기·행간·자간이 한 벌이라 낱개로 쓰지 않고 통째로 펼쳐 쓴다.
 */
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
  /** 질문 입력 — 입력한 질문 자체가 화면의 제목 역할을 한다 */
  display: {
    fontSize: '30px',
    fontWeight: 590,
    lineHeight: 1.35,
    letterSpacing: '-0.02em',
  },
} as const;

/** 답변에 대응하는 강조 색 */
export const answerColor = {
  YES: theme.color.yes,
  NO: theme.color.no,
} as const;
