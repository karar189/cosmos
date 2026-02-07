/** @jsxImportSource @emotion/react */
'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import { MultiLineChart, Toggle, type ToggleOption } from '@core3/ui-components';
import type {
  PolCategoriesChartProps,
  PolCategoriesTimeRange,
} from '@/types/charts/PolCategoriesChart';
import {
  POL_CATEGORIES_Y_DOMAIN,
  POL_CATEGORIES_Y_TICKS,
  POL_CATEGORIES_TIME_RANGES,
} from '../shared/chartConstants';
import { useChartDimensions } from '../shared/useChartDimensions';
import { filterChartDataByTimeRange } from '@/utils/charts';
import * as styles from './PolCategoriesChart.styles';

const TIME_RANGE_OPTIONS: ToggleOption<PolCategoriesTimeRange>[] = POL_CATEGORIES_TIME_RANGES.map(
  (range) => ({ value: range, label: range })
);

export default function PolCategoriesChart({
  data,
  lines,
  title = 'PoL Categories Dynamic',
  showTimeRange = true,
  initialTimeRange = '1Y',
}: PolCategoriesChartProps) {
  const [timeRange, setTimeRange] = useState<PolCategoriesTimeRange>(initialTimeRange);
  const { multiLineChartHeight, defaultMargin } = useChartDimensions();

  const filteredData = filterChartDataByTimeRange(data, timeRange);

  return (
    <Box css={styles.chartCard}>
      <Box css={styles.header}>
        {title && <Box css={styles.title}>{title}</Box>}
        
        {showTimeRange && (
          <Toggle
            value={timeRange}
            onChange={setTimeRange}
            options={TIME_RANGE_OPTIONS}
            useButtonStyle={true}
          />
        )}
      </Box>

      <MultiLineChart
        data={filteredData}
        lines={lines}
        xDataKey="x"
        height={multiLineChartHeight}
        invertYAxis={true}
        yDomain={POL_CATEGORIES_Y_DOMAIN}
        yTicks={[...POL_CATEGORIES_Y_TICKS]}
        margin={defaultMargin}
      />
    </Box>
  );
}

