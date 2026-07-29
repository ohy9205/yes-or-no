/** 화면 전반에서 쓰는 색·간격 토큰 */
export const theme = {
  color: {
    background: '#ffffff',
    text: '#191f28',
    subText: '#8b95a1',
    yes: '#3182f6',
    no: '#f04452',
  },
  space: {
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '40px',
  },
} as const;

/** 답변에 대응하는 강조 색 */
export const answerColor = {
  YES: theme.color.yes,
  NO: theme.color.no,
} as const;
