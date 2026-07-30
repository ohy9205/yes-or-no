import { tiltText } from '../decision/decide';
import type { DecisionResult } from '../decision/result';
import { scoreText } from '../decision/series';
import { extrudeLayers, frontStops } from '../../styles/extrude';
import { STAGE_LINE_HEIGHT } from '../../styles/stage';
import { answerColor, theme } from '../../styles/theme';

const SIZE = 1080;
const FONT_STACK = `system-ui, -apple-system, 'Segoe UI', Roboto, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`;
const QUESTION_MAX_LINES = 3;

/** 카드 중앙을 채우는 대형 타이포 */
const ANSWER_SIZE = 320;
const ANSWER_Y = 580;

/** 판별 결과 점 */
const PIP_RADIUS = 15;
const PIP_GAP = 46;
const PIP_Y = 760;
const SCORE_Y = 840;

/** `wrapText`가 쓰는 캔버스 기능만 좁힌 타입 */
export type TextMeasurer = Pick<CanvasRenderingContext2D, 'measureText'>;

/**
 * 공유용 결과 카드를 오프스크린 캔버스에 그려 PNG data URL로 반환한다.
 * `data:image/png;base64,` 프리픽스가 포함된 문자열이다.
 */
export function renderResultCard({ question, answer, draws, tilt }: DecisionResult): string {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;

  const ctx = canvas.getContext('2d');
  if (ctx === null) {
    throw new Error('캔버스를 만들 수 없어요');
  }

  ctx.fillStyle = theme.color.background;
  ctx.fillRect(0, 0, SIZE, SIZE);

  ctx.textAlign = 'center';

  // 질문 — 카드 위쪽, 길면 줄바꿈 후 말줄임
  ctx.fillStyle = theme.color.subText;
  ctx.font = `600 46px ${FONT_STACK}`;
  ctx.textBaseline = 'middle';
  const lines = wrapText(ctx, question, SIZE - 160, QUESTION_MAX_LINES);
  const lineHeight = 64;
  const questionTop = 260 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => {
    ctx.fillText(line, SIZE / 2, questionTop + i * lineHeight);
  });

  // 결과 — 두께 겹을 먼 것부터 깔고 그라데이션 앞면을 덮는다
  const label = `${answer}!`;
  ctx.font = `700 ${ANSWER_SIZE}px ${FONT_STACK}`;
  const layers = extrudeLayers(answer);
  for (let i = layers.length - 1; i >= 0; i--) {
    const shift = layers[i].offset * ANSWER_SIZE;
    ctx.fillStyle = layers[i].color;
    ctx.fillText(label, SIZE / 2 + shift, ANSWER_Y + shift);
  }

  // 화면과 같은 비율로 훑도록 글자 줄 높이를 그대로 쓴다
  const box = (ANSWER_SIZE * STAGE_LINE_HEIGHT) / 2;
  const front = ctx.createLinearGradient(0, ANSWER_Y - box, 0, ANSWER_Y + box);
  frontStops(answer).forEach(({ at, color }) => front.addColorStop(at, color));
  ctx.fillStyle = front;
  ctx.fillText(label, SIZE / 2, ANSWER_Y);

  // 판별 결과와 집계 — 삼세번일 때만. 실제로 뽑은 판만 그린다
  if (draws.length > 1) {
    const left = SIZE / 2 - (PIP_GAP * (draws.length - 1)) / 2;
    draws.forEach((drawn, i) => {
      ctx.beginPath();
      ctx.fillStyle = answerColor[drawn];
      ctx.arc(left + PIP_GAP * i, PIP_Y, PIP_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = theme.color.text;
    ctx.font = `600 44px ${FONT_STACK}`;
    ctx.fillText(scoreText(draws), SIZE / 2, SCORE_Y);
  }

  ctx.fillStyle = theme.color.faintText;
  ctx.font = `500 34px ${FONT_STACK}`;

  // 기울임 표기 — 기울였을 때만
  const notice = tiltText(tilt);
  if (notice !== null) {
    ctx.fillText(`${notice}로 뽑았어요`, SIZE / 2, SIZE - 180);
  }

  // 하단 워터마크
  ctx.fillText('재미로 보는 결과예요 · YES / NO', SIZE / 2, SIZE - 110);

  return canvas.toDataURL('image/png');
}

/**
 * 주어진 폭에 맞게 줄을 나누고, 최대 줄 수를 넘으면 마지막 줄을 말줄임 처리한다.
 * 어절 단위로 끊되, 한 어절이 그대로는 안 들어가면 글자 단위로 쪼갠다.
 */
export function wrapText(
  ctx: TextMeasurer,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const lines: string[] = [];
  let current = '';

  const flush = () => {
    if (current !== '') {
      lines.push(current);
      current = '';
    }
  };

  for (const word of text.split(' ')) {
    const candidate = current === '' ? word : `${current} ${word}`;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
      continue;
    }
    flush();

    if (ctx.measureText(word).width <= maxWidth) {
      current = word;
      continue;
    }
    for (const char of word) {
      if (ctx.measureText(current + char).width > maxWidth && current !== '') {
        flush();
      }
      current += char;
    }
  }
  flush();

  if (lines.length <= maxLines) {
    return lines;
  }
  const kept = lines.slice(0, maxLines);
  kept[maxLines - 1] = ellipsize(ctx, kept[maxLines - 1], maxWidth);
  return kept;
}

function ellipsize(ctx: TextMeasurer, line: string, maxWidth: number): string {
  let trimmed = line;
  while (trimmed.length > 0 && ctx.measureText(`${trimmed}…`).width > maxWidth) {
    trimmed = trimmed.slice(0, -1);
  }
  return `${trimmed}…`;
}
