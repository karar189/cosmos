/** @jsxImportSource @emotion/react */
'use client';

import React from 'react';
import { Box } from '@mui/material';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  Cell,
} from 'recharts';
import { colors, typographyValues } from '../../../styleSystem';
import * as styles from './StackedBarChart.styles';

export type StackedBarChartDataPoint = {
  /** X-axis label (e.g., date, month, category) */
  name: string;
  /** Positive value (displayed above 0) */
  positive: number;
  /** Negative value (displayed below 0) */
  negative: number;
  [key: string]: string | number;
};

export type StackedBarChartProps = {
  /** Array of data points to display */
  data: StackedBarChartDataPoint[];
  /** Height of the chart in pixels */
  height?: number;
  /** Color for positive values */
  positiveColor?: string;
  /** Color for negative values */
  negativeColor?: string;
  /** Custom tooltip formatter */
  tooltipFormatter?: (value: number, name: string) => [string, string];
  /** Custom label formatter for X-axis */
  xAxisLabelFormatter?: (label: string) => string;
  /** Custom label formatter for Y-axis */
  yAxisLabelFormatter?: (label: number) => string;
  /** X-axis tick interval. Use 'preserveStartEnd' for auto-spacing, or a number for fixed interval */
  xAxisInterval?:
    | number
    | 'preserveStart'
    | 'preserveEnd'
    | 'preserveStartEnd'
    | 'equidistantPreserveStart';
};

const StackedBarChart: React.FC<StackedBarChartProps> = (props) => {
  const {
    data,
    height = 300,
    positiveColor = colors.chart.positive,
    negativeColor = colors.chart.negative,
    tooltipFormatter,
    xAxisLabelFormatter,
    yAxisLabelFormatter,
    xAxisInterval = 'preserveStartEnd',
  } = props;

  const GAP_SIZE = 4;
  const chartData = React.useMemo(() => {
    return data.map((item) => ({
      ...item,
      positiveSpacer: GAP_SIZE / 2,
      negativeSpacer: -(GAP_SIZE / 2),
      positive: item.positive,
      negative: item.negative > 0 ? -item.negative : item.negative,
    }));
  }, [data]);

  const tickColor = `${colors.neutral.gray650}80`;

  const AXIS_TICK_STYLE: React.CSSProperties = {
    fontSize: typographyValues.fontSize.xs,
    fontFamily: typographyValues.fontFamily.primary,
  };

  type TooltipPayload = {
    value: number;
    name: string;
    color: string;
    dataKey: string;
  };

  type CustomTooltipProps = TooltipProps<number, string> & {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
  };

  const CustomTooltip = (tooltipProps: CustomTooltipProps) => {
    const { active, payload, label } = tooltipProps;
    if (!active || !payload || !payload.length) return null;

    const filteredPayload = payload.filter(
      (entry) => !['positiveSpacer', 'negativeSpacer'].includes(entry.dataKey as string)
    );

    return (
      <Box css={styles.tooltip}>
        <Box css={styles.tooltipLabel}>{label}</Box>
        {filteredPayload.map((entry, index) => {
          const value = Math.abs(entry.value);
          const name = entry.dataKey === 'positive' ? 'Positive' : 'Negative';
          const formattedValue = tooltipFormatter ? tooltipFormatter(value, name)[0] : `${value}%`;

          return (
            <Box key={index} css={styles.tooltipItem}>
              <Box css={styles.tooltipDot} style={{ backgroundColor: entry.color }} />
              <Box css={styles.tooltipText}>{name}</Box>
              <Box css={styles.tooltipValue}>{formattedValue}</Box>
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Box css={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={chartData}
          stackOffset="sign"
          margin={{ top: 20, right: 0, left: 10, bottom: 0 }}
        >
          <XAxis
            dataKey="name"
            tick={{ fill: tickColor }}
            style={AXIS_TICK_STYLE}
            axisLine={false}
            tickLine={false}
            tickFormatter={xAxisLabelFormatter}
            interval={xAxisInterval}
          />
          <YAxis
            orientation="right"
            tick={{ fill: tickColor }}
            style={AXIS_TICK_STYLE}
            axisLine={false}
            tickLine={false}
            tickFormatter={(val) =>
              yAxisLabelFormatter ? yAxisLabelFormatter(Math.abs(val)) : `${Math.abs(val)}%`
            }
            domain={[-100, 100]}
            ticks={[-100, -50, 0, 50, 100]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />

          <Bar
            dataKey="positiveSpacer"
            fill="transparent"
            stackId="stack"
            barSize={16}
            isAnimationActive={false}
          />
          <Bar
            dataKey="negativeSpacer"
            fill="transparent"
            stackId="stack"
            barSize={16}
            isAnimationActive={false}
          />

          <Bar
            dataKey="positive"
            fill={positiveColor}
            stackId="stack"
            barSize={16}
            radius={[8, 8, 8, 8]}
          >
            {chartData.map((_entry, index) => (
              <Cell key={`cell-pos-${index}`} fill={positiveColor} />
            ))}
          </Bar>
          <Bar
            dataKey="negative"
            fill={negativeColor}
            stackId="stack"
            barSize={16}
            radius={[8, 8, 8, 8]}
          >
            {chartData.map((_entry, index) => (
              <Cell key={`cell-neg-${index}`} fill={negativeColor} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default StackedBarChart;
