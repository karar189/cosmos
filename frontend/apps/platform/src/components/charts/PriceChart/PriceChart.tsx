/** @jsxImportSource @emotion/react */
'use client';

import { useState, useMemo } from 'react';
import { Box } from '@mui/material';
import { SingleLineChart, Toggle, type ToggleOption } from '@core3/ui-components';
import useTranslation from '@/hooks/useTranslation';
import type {
  PriceChartProps,
  PriceChartType,
  PriceChartTimeRange,
} from '@/types/charts/PriceChart';
import { PRICE_CHART_TIME_RANGES } from '../shared/chartConstants';
import { useChartDimensions } from '../shared/useChartDimensions';
import * as styles from './PriceChart.styles';

export default function PriceChart({
  priceData,
  marketCapData,
  initialChartType = 'price',
  initialTimeRange = '7D',
  showChartTypeToggle = true,
  showTimeRange = true,
  priceYDomain = [55, 80],
  priceYTicks = [60, 65, 70, 75],
}: PriceChartProps) {
  const { t } = useTranslation(['common']);
  const [chartType, setChartType] = useState<PriceChartType>(initialChartType);
  const [timeRange, setTimeRange] = useState<PriceChartTimeRange>(initialTimeRange);
  const { singleLineChartHeight } = useChartDimensions();

  const chartTypeOptions: ToggleOption<PriceChartType>[] = useMemo(
    () => [
      {
        value: 'price',
        label: t('charts.chartType.price.label'),
        ariaLabel: t('charts.chartType.price.ariaLabel'),
      },
      {
        value: 'marketCap',
        label: t('charts.chartType.marketCap.label'),
        ariaLabel: t('charts.chartType.marketCap.ariaLabel'),
      },
    ],
    [t]
  );

  const timeRangeOptions: ToggleOption<PriceChartTimeRange>[] = useMemo(
    () => PRICE_CHART_TIME_RANGES.map((range) => ({ value: range, label: range })),
    []
  );

  const currentData = (chartType === 'price' ? priceData : marketCapData).map(
    (point) => ({
      x: point.date,
      value: point.value,
    })
  );

  return (
    <Box css={styles.chartCard}>
      <Box css={styles.header}>
        {showChartTypeToggle && (
          <Toggle
            value={chartType}
            onChange={setChartType}
            options={chartTypeOptions}
            ariaLabel={t('charts.chartType.ariaLabel')}
          />
        )}

        {showTimeRange && (
          <Toggle
            value={timeRange}
            onChange={setTimeRange}
            options={timeRangeOptions}
            useButtonStyle={true}
          />
        )}
      </Box>

      <SingleLineChart
        data={currentData}
        xDataKey="x"
        yDataKey="value"
        yDomain={chartType === 'price' ? priceYDomain : undefined}
        yTicks={chartType === 'price' ? priceYTicks : undefined}
        height={singleLineChartHeight}
      />
    </Box>
  );
}

