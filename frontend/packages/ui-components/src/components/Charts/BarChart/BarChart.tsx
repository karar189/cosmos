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
} from 'recharts';
import { colors, typographyValues } from '../../../styleSystem';
import * as styles from './BarChart.styles';

export type BarChartDataPoint = {
  /** X-axis label (e.g., date, month, category) - key name can be customized via xDataKey prop */
  [key: string]: string | number;
};

export type BarChartProps = {
  /** Array of data points to display */
  data: BarChartDataPoint[];
  /** Y-axis domain [min, max]. If not provided, will be calculated from data */
  yDomain?: [number, number];
  /** Custom Y-axis tick values. If not provided, will be auto-generated */
  yTicks?: number[];
  /** Height of the chart in pixels */
  height?: number;
  /** Color of the bars */
  barColor?: string;
  /** Width of the bars in pixels. If not provided, bars will auto-size */
  barSize?: number;
  /** X-axis data key (default: 'x') */
  xDataKey?: string;
  /** Y-axis data key (default: 'value') */
  yDataKey?: string;
  /** Custom tooltip formatter */
  tooltipFormatter?: (value: number, name: string) => [string, string];
  /** Custom label formatter for X-axis */
  xAxisLabelFormatter?: (label: string) => string;
  /** Custom label formatter for Y-axis */
  yAxisLabelFormatter?: (label: string) => string;
  /** Custom margin for the chart */
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
};

const BarChart: React.FC<BarChartProps> = (props) => {
  const {
    data,
    yDomain,
    yTicks,
    height = 300,
    barColor = colors.neutral.gray650,
    barSize,
    xDataKey = 'x',
    yDataKey = 'value',
    tooltipFormatter,
    xAxisLabelFormatter,
    yAxisLabelFormatter,
    margin = {
      top: 5,
      right: 0,
      left: 0,
      bottom: 5,
    },
  } = props;

  // Calculate domain from data if not provided
  const calculatedDomain = React.useMemo(() => {
    if (yDomain) return yDomain;
    if (data.length === 0) return [0, 100];
    const values = data.map((d) => {
      const value = d[yDataKey];
      return typeof value === 'number' ? value : 0;
    });
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;
    return [Math.max(0, min - padding), max + padding];
  }, [data, yDataKey, yDomain]);

  // Calculate ticks from data if not provided
  const calculatedTicks = React.useMemo(() => {
    if (yTicks) return yTicks;
    const [min, max] = calculatedDomain;
    const range = max - min;
    const step = range / 4;
    const ticks: number[] = [];
    for (let i = 0; i <= 4; i++) {
      ticks.push(Math.round((min + step * i) * 100) / 100);
    }
    return ticks;
  }, [calculatedDomain, yTicks]);

  // Chart tick color - gray650 with 50% opacity
  const tickColor = `${colors.neutral.gray650}80`; // 80 in hex = 50% opacity (128/255)

  // Tooltip contentStyle - Recharts requires plain objects, not CSS-in-JS
  // Using values from styling system: colors.neutral.white, colors.neutral.gray300, borders.radius.base (0.25rem = 4px)
  const TOOLTIP_CONTENT_STYLE: React.CSSProperties = {
    backgroundColor: colors.neutral.white, // From coloring.background.neutral.default
    border: `1px solid ${colors.neutral.gray300}`, // From borders.gray300
    borderRadius: '0.25rem', // From borders.radius.base (4px)
  };

  // Chart axis tick styles - uses typography values from theme
  // Note: Recharts components use the `style` prop (plain objects), not Emotion CSS
  const AXIS_TICK_STYLE: React.CSSProperties = {
    fontSize: typographyValues.fontSize.xs,
    fontFamily: typographyValues.fontFamily.primary,
  };

  const Y_AXIS_TICK_STYLE: React.CSSProperties = {
    fontSize: typographyValues.fontSize.xs,
    fontFamily: typographyValues.fontFamily.primary,
    fontWeight: typographyValues.fontWeight.normal,
  };

  type TooltipPayload = {
    value: number;
    dataKey: string;
    payload: BarChartDataPoint;
  };

  type CustomTooltipProps = TooltipProps<number, string> & {
    payload?: TooltipPayload[];
  };

  const CustomTooltip = (tooltipProps: CustomTooltipProps) => {
    const { active, payload } = tooltipProps;
    if (!active || !payload || !payload.length) return null;

    const value = payload[0]?.value as number;
    const formattedValue = tooltipFormatter
      ? tooltipFormatter(value, yDataKey)[0]
      : value.toString();

    return (
      <Box css={styles.tooltip}>
        <Box css={styles.tooltipValue}>{formattedValue}</Box>
      </Box>
    );
  };

  return (
    <Box css={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={data} margin={margin}>
          <XAxis
            dataKey={xDataKey}
            tick={{
              fill: tickColor,
            }}
            style={AXIS_TICK_STYLE}
            padding={{ left: 8 }}
            interval={0}
            tickMargin={8}
            axisLine={false}
            tickLine={false}
            tickFormatter={xAxisLabelFormatter}
          />
          <YAxis
            orientation="right"
            tick={{
              fill: tickColor,
            }}
            style={Y_AXIS_TICK_STYLE}
            axisLine={false}
            tickLine={false}
            domain={calculatedDomain}
            ticks={calculatedTicks}
            tickFormatter={yAxisLabelFormatter}
          />
          <Tooltip
            content={<CustomTooltip />}
            contentStyle={TOOLTIP_CONTENT_STYLE}
          />
          <Bar
            dataKey={yDataKey}
            fill={barColor}
            radius={[6, 6, 6, 6]}
            barSize={barSize}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BarChart;

