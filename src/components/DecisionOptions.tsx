import { css } from '@emotion/react';
import { ListRow, SegmentedControl, Switch } from '@toss/tds-mobile';
import { TILT_PERCENT, type Answer } from '../features/decision/decide';
import type { DecisionOptions as Options } from '../features/decision/options';
import { theme } from '../styles/theme';

interface Props {
  value: Options;
  onChange: (options: Options) => void;
}

/** 기울이지 않음을 나타내는 세그먼트 값 */
const EVEN = 'even';

/** 추첨 방식을 고르는 idle 화면의 옵션 영역 */
export function DecisionOptions({ value, onChange }: Props) {
  const handleTilt = (next: string) => {
    onChange({ ...value, tilt: next === EVEN ? null : (next as Answer) });
  };

  return (
    <div css={panel}>
      <div>
        <SegmentedControl value={value.tilt ?? EVEN} onChange={handleTilt}>
          <SegmentedControl.Item value="NO">NO 쪽</SegmentedControl.Item>
          <SegmentedControl.Item value={EVEN}>반반</SegmentedControl.Item>
          <SegmentedControl.Item value="YES">YES 쪽</SegmentedControl.Item>
        </SegmentedControl>
        <p css={hint}>
          {value.tilt === null
            ? 'YES와 NO가 나올 확률이 같아요'
            : `${value.tilt}가 나올 확률 ${TILT_PERCENT}%`}
        </p>
      </div>
      <ListRow
        css={row}
        border="none"
        horizontalPadding="small"
        contents={
          <ListRow.Texts type="2RowTypeA" top="한국인은 삼세번" bottom="세 번 뽑아 2승이 이겨요" />
        }
        right={
          <Switch
            checked={value.bestOfThree}
            onChange={(_, checked) => onChange({ ...value, bestOfThree: checked })}
          />
        }
      />
    </div>
  );
}

const panel = css({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.space.sm,
});

/** 화면 좌우 여백만큼 당겨 목록 행을 가장자리까지 붙인다 */
const row = css({
  margin: `0 -${theme.space.md}`,
});

const hint = css({
  margin: `${theme.space.sm} 0 0`,
  fontSize: '13px',
  lineHeight: 1.4,
  color: theme.color.subText,
});
