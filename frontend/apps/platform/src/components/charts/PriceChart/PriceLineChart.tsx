/** @jsxImportSource @emotion/react */
import React from 'react';
import { Box } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { colors } from '@core3/ui-components/styleSystem';
import type { PriceLineChartProps } from '@/types/charts/PriceLineChart';
import { useChartDimensions } from '../shared/useChartDimensions';
import * as styles from './PriceChart.styles';

const PriceLineChart: React.FC<PriceLineChartProps> = (props) => {
  const {
    data,
    yDomain = [55, 80],
    yTicks = [60, 65, 70, 75],
  } = props;

  const { singleLineChartHeight, singleLineMargin } = useChartDimensions();

  // Chart tick color from theme
  const tickColor = colors.chart.tickColor;

  return (
    <Box css={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={singleLineChartHeight}>
        <LineChart
          data={data}
          margin={singleLineMargin}
        >
          <XAxis
            dataKey="date"
            tick={{
              fill: tickColor,
            }}
            css={styles.axisTick}
            interval={0}
            tickMargin={8}
            padding={{ left: 10, right: 24 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            orientation="right"
            tick={{
              fill: tickColor,
            }}
            css={styles.yAxisTick}
            axisLine={false}
            tickLine={false}
            domain={yDomain}
            ticks={yTicks}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: colors.neutral.white,
              border: `1px solid ${colors.neutral.gray300}`,
              borderRadius: '4px',
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={colors.text.primary}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: colors.text.primary }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PriceLineChart;
export { PriceLineChart };

