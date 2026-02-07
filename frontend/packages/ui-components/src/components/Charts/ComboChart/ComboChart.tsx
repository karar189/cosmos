/** @jsxImportSource @emotion/react */
'use client';

import React from 'react';
import { Box } from '@mui/material';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { colors, typographyValues } from '../../../styleSystem';
import * as styles from './ComboChart.styles';

export type ComboChartDataPoint = {
  /** X-axis label (e.g., date, month, category) - key name can be customized via xDataKey prop */
  [key: string]: string | number;
};

export type ComboChartProps = {
  /** Array of data points to display */
  data: ComboChartDataPoint[];
  /** Y-axis domain [min, max] for the line. If not provided, will be calculated from data */
  lineYDomain?: [number, number];
  /** Y-axis domain [min, max] for the bars. If not provided, will be calculated from data */
  barYDomain?: [number, number];
  /** Custom Y-axis tick values for the line. If not provided, will be auto-generated */
  lineYTicks?: number[];
  /** Custom Y-axis tick values for the bars. If not provided, will be auto-generated */
  barYTicks?: number[];
  /** Height of the chart in pixels */
  height?: number;
  /** Color of the line */
  lineColor?: string;
  /** Color of the bars */
  barColor?: string;
  /** X-axis data key (default: 'x') */
  xDataKey?: string;
  /** Line data key (default: 'lineValue') */
  lineDataKey?: string;
  /** Bar data key (default: 'barValue') */
  barDataKey?: string;
  /** Custom tooltip formatter */
  tooltipFormatter?: (value: number, name: string, dataKey: string) => [string, string];
  /** Custom label formatter for X-axis */
  xAxisLabelFormatter?: (label: string) => string;
  /** Custom label formatter for Y-axis (line) */
  lineYAxisLabelFormatter?: (label: string) => string;
  /** Custom label formatter for Y-axis (bar) */
  barYAxisLabelFormatter?: (label: string) => string;
  /** Hide Y-axis labels */
  hideYAxisLabels?: boolean;
  /** Bar size (width) in pixels */
  barSize?: number;
  /** Custom margin for the chart */
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  /** X-axis interval. If not provided, will auto-calculate to show ~5-6 labels */
  xAxisInterval?: number | 'preserveStartEnd';
};

const ComboChart: React.FC<ComboChartProps> = (props) => {
  const {
    data,
    lineYDomain,
    barYDomain,
    lineYTicks,
    barYTicks,
    height = 300,
    lineColor = colors.text.primary,
    barColor = colors.neutral.gray300,
    xDataKey = 'x',
    lineDataKey = 'lineValue',
    barDataKey = 'barValue',
    tooltipFormatter,
    xAxisLabelFormatter,
    lineYAxisLabelFormatter,
    barYAxisLabelFormatter,
    hideYAxisLabels = false,
    barSize,
    xAxisInterval,
    margin = {
      top: 5,
      right: 0,
      left: 0,
      bottom: 5,
    },
  } = props;

  // Calculate X-axis interval to show ~5-6 labels if not provided
  const calculatedXInterval = React.useMemo(() => {
    if (xAxisInterval !== undefined) return xAxisInterval;
    if (data.length <= 6) return 0; // Show all if 6 or fewer
    return Math.floor(data.length / 5); // Show ~5 labels
  }, [data.length, xAxisInterval]);

  // Calculate line domain from data if not provided
  const calculatedLineDomain = React.useMemo(() => {
    if (lineYDomain) return lineYDomain;
    if (data.length === 0) return [0, 100];
    const values = data.map((d) => {
      const value = d[lineDataKey];
      return typeof value === 'number' ? value : 0;
    });
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;
    return [Math.max(0, min - padding), max + padding];
  }, [data, lineDataKey, lineYDomain]);

  // Calculate bar domain from data if not provided
  const calculatedBarDomain = React.useMemo(() => {
    if (barYDomain) return barYDomain;
    if (data.length === 0) return [0, 100];
    const values = data.map((d) => {
      const value = d[barDataKey];
      return typeof value === 'number' ? value : 0;
    });
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1;
    return [Math.max(0, min - padding), max + padding];
  }, [data, barDataKey, barYDomain]);

  // Calculate line ticks from data if not provided
  const calculatedLineTicks = React.useMemo(() => {
    if (lineYTicks) return lineYTicks;
    const [min, max] = calculatedLineDomain;
    const range = max - min;
    const step = range / 4;
    const ticks: number[] = [];
    for (let i = 0; i <= 4; i++) {
      ticks.push(Math.round((min + step * i) * 100) / 100);
    }
    return ticks;
  }, [calculatedLineDomain, lineYTicks]);

  // Calculate bar ticks from data if not provided
  const calculatedBarTicks = React.useMemo(() => {
    if (barYTicks) return barYTicks;
    const [min, max] = calculatedBarDomain;
    const range = max - min;
    const step = range / 4;
    const ticks: number[] = [];
    for (let i = 0; i <= 4; i++) {
      ticks.push(Math.round((min + step * i) * 100) / 100);
    }
    return ticks;
  }, [calculatedBarDomain, barYTicks]);

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
    name?: string;
    color?: string;
    payload: ComboChartDataPoint;
  };

  type CustomTooltipProps = TooltipProps<number, string> & {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
  };

  const CustomTooltip = (tooltipProps: CustomTooltipProps) => {
    const { active, payload } = tooltipProps;
    if (!active || !payload || !payload.length) return null;

    return (
      <Box css={styles.tooltip}>
        {payload.map((entry: TooltipPayload, index: number) => {
          const value = entry.value as number;
          const formattedValue = tooltipFormatter
            ? tooltipFormatter(value, entry.name || '', entry.dataKey || '')[0]
            : value.toString();
          const label = tooltipFormatter
            ? tooltipFormatter(value, entry.name || '', entry.dataKey || '')[1]
            : entry.name || entry.dataKey || '';

          return (
            <Box key={index} css={styles.tooltipItem}>
              <Box css={styles.tooltipDot} style={{ backgroundColor: entry.color }} />
              <Box css={styles.tooltipLabel}>{label}</Box>
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
        <ComposedChart data={data} margin={margin} barCategoryGap={1}>
          <XAxis
            dataKey={xDataKey}
            tick={{
              fill: tickColor,
            }}
            style={AXIS_TICK_STYLE}
            interval={calculatedXInterval}
            tickMargin={8}
            padding={{ left: 0, right: 0 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={xAxisLabelFormatter}
            domain={['dataMin', 'dataMax']}
            allowDataOverflow={true}
          />
          <YAxis
            yAxisId="line"
            orientation="right"
            tick={{
              fill: hideYAxisLabels ? 'transparent' : tickColor,
            }}
            style={Y_AXIS_TICK_STYLE}
            axisLine={false}
            tickLine={false}
            domain={calculatedLineDomain}
            ticks={calculatedLineTicks}
            tickFormatter={hideYAxisLabels ? () => '' : lineYAxisLabelFormatter}
          />
          <YAxis
            yAxisId="bar"
            orientation="left"
            tick={{
              fill: hideYAxisLabels ? 'transparent' : tickColor,
            }}
            style={Y_AXIS_TICK_STYLE}
            axisLine={false}
            tickLine={false}
            domain={calculatedBarDomain}
            ticks={calculatedBarTicks}
            tickFormatter={hideYAxisLabels ? () => '' : barYAxisLabelFormatter}
          />
          <Tooltip
            content={<CustomTooltip />}
            contentStyle={TOOLTIP_CONTENT_STYLE}
          />
          <Bar
            yAxisId="bar"
            dataKey={barDataKey}
            fill={barColor}
            radius={[4, 4, 0, 0]}
            barSize={barSize}
          />
          <Line
            yAxisId="line"
            type="monotone"
            dataKey={lineDataKey}
            stroke={lineColor}
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 4, fill: lineColor }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ComboChart;

