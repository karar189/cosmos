/** @jsxImportSource @emotion/react */
'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import { SingleLineChart, Icon, Toggle, type ToggleOption } from '@core3/ui-components';
import { colors } from '@core3/ui-components/styleSystem';
import type { ActiveAddressesChartProps, ActiveAddressesTimeRange } from '@/types/charts/ActiveAddressesChart';
import { formatValue } from '@/utils/charts';
import { ACTIVE_ADDRESSES_TIME_RANGES } from '../shared/chartConstants';
import { useChartDimensions } from '../shared/useChartDimensions';
import * as styles from './ActiveAddressesChart.styles';

const TIME_RANGE_OPTIONS: ToggleOption<ActiveAddressesTimeRange>[] = ACTIVE_ADDRESSES_TIME_RANGES.map(
  (range) => ({ value: range, label: range })
);

export default function ActiveAddressesChart({
  data,
  title = 'Active Addresses',
  showTimeRange = true,
  initialTimeRange = '7D',
  yDomain = [600, 1000],
  yTicks = [600, 700, 800, 900, 1000],
  showInfoIcon = true,
}: ActiveAddressesChartProps) {
  const [timeRange, setTimeRange] = useState<ActiveAddressesTimeRange>(initialTimeRange);
  const { singleLineChartHeight } = useChartDimensions();

  return (
    <Box css={styles.chartCard}>
      <Box css={styles.header}>
        <Box css={styles.titleContainer}>
          <Box css={styles.title}>{title}</Box>
          {showInfoIcon && <Icon name="info" css={styles.infoIcon} />}
        </Box>
        {showTimeRange && (
          <Toggle
            value={timeRange}
            onChange={setTimeRange}
            options={TIME_RANGE_OPTIONS}
            useButtonStyle={true}
          />
        )}
      </Box>
      <SingleLineChart
        data={data}
        xDataKey="x"
        yDataKey="value"
        height={singleLineChartHeight}
        lineColor={colors.text.primary}
        yDomain={yDomain}
        yTicks={yTicks}
        yAxisLabelFormatter={(label) => {
          const num = Number(label);
          if (num >= 1000) return '1M';
          return `${num}K`;
        }}
        tooltipFormatter={(value) => [formatValue(value, 'addresses'), 'Active Addresses']}
      />
    </Box>
  );
}
