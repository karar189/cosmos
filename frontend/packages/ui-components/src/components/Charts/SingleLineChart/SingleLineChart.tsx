/** @jsxImportSource @emotion/react */
'use client';

import React from 'react';
import { Box } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { colors, typographyValues } from '../../../styleSystem';
import { Icon } from '../../Icon';
import { IconName } from '../../Icon/iconRegistry';
import { Tooltip as TooltipComponent } from '../../Tooltip';
import { BlurOverlay } from '../../BlurOverlay';
import * as styles from './SingleLineChart.styles';

/**
 * Format date string (YYYY-MM-DD) to "Mar 7" format for chart labels
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Formatted date string like "Mar 7"
 */
export function formatDateLabel(dateString: string): string {
  try {
    const date = new Date(dateString);
    // TODO: add i18n for month names
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    return `${month} ${day}`;
  } catch {
    return dateString;
  }
}

// Default mock data used when no data is provided
const DEFAULT_MOCK_DATA: SingleLineChartDataPoint[] = [
  { x: 'Jan', value: 45 },
  { x: 'Feb', value: 52 },
  { x: 'Mar', value: 48 },
  { x: 'Apr', value: 61 },
  { x: 'May', value: 55 },
  { x: 'Jun', value: 67 },
  { x: 'Jul', value: 72 },
  { x: 'Aug', value: 68 },
  { x: 'Sep', value: 79 },
  { x: 'Oct', value: 85 },
  { x: 'Nov', value: 81 },
  { x: 'Dec', value: 90 },
];

// Chart axis tick styles - uses typography values from theme
// Note: Recharts components use the `style` prop (plain objects), not Emotion CSS
// Using typographyValues for raw string values that can be used in React.CSSProperties
const AXIS_TICK_STYLE: React.CSSProperties = {
  fontSize: typographyValues.fontSize.xs,
  fontFamily: typographyValues.fontFamily.primary,
};

const Y_AXIS_TICK_STYLE: React.CSSProperties = {
  fontSize: typographyValues.fontSize.xs,
  fontFamily: typographyValues.fontFamily.primary,
  fontWeight: typographyValues.fontWeight.normal,
};

// Tooltip contentStyle - Recharts requires plain objects, not CSS-in-JS
// Using values from styling system: colors.neutral.white, colors.neutral.gray300, borders.radius.base (0.25rem = 4px)
const TOOLTIP_CONTENT_STYLE: React.CSSProperties = {
  backgroundColor: colors.neutral.white, // From coloring.background.neutral.default
  border: `1px solid ${colors.neutral.gray300}`, // From borders.gray300
  borderRadius: '0.25rem', // From borders.radius.base (4px)
};

export type SingleLineChartDataPoint = {
  /** X-axis label (e.g., date, month, category) - key name can be customized via xDataKey prop */
  [key: string]: string | number;
};

export type SingleLineChartProps = {
  /** Array of data points to display */
  data?: SingleLineChartDataPoint[];
  /** Y-axis domain [min, max]. If not provided, will be calculated from data */
  yDomain?: [number, number];
  /** Custom Y-axis tick values. If not provided, will be auto-generated */
  yTicks?: number[];
  /** Height of the chart in pixels */
  height?: number;
  /** Color of the line */
  lineColor?: string;
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
  /** Show dots on the line */
  showDots?: boolean;
  /** X-axis tick interval. 0 shows all, 'preserveStartEnd' preserves first and last, or a number for every Nth tick */
  xAxisInterval?: number | 'preserveStartEnd';
  /** Custom margin for the chart */
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  /** Variant: withContainer - adds container with title, icon, and tooltip */
  variant?: 'default' | 'withContainer';
  /** Title text (only for withContainer variant) */
  title?: string;
  /** Icon name (only for withContainer variant) */
  icon?: IconName;
  /** Tooltip text (only for withContainer variant) - if present, renders info icon */
  tooltipText?: string;
  /** Title displayed on blur overlay when data is empty */
  emptyTitle?: string;
  /** Description displayed on blur overlay when data is empty */
  emptyDescription?: string;
  /** Show loading state with blur overlay and spinner */
  loading?: boolean;
};

const SingleLineChart: React.FC<SingleLineChartProps> = (props) => {
  const {
    data,
    yDomain,
    yTicks,
    height = 300,
    lineColor = colors.text.primary,
    xDataKey = 'x',
    yDataKey = 'value',
    tooltipFormatter,
    xAxisLabelFormatter,
    yAxisLabelFormatter,
    showDots = false,
    xAxisInterval = 0,
    margin = {
      top: 5,
      right: 0,
      left: 0,
      bottom: 5,
    },
    variant = 'default',
    title,
    icon,
    tooltipText,
    emptyTitle,
    emptyDescription = 'No data',
    loading = false,
  } = props;

  // Check if data is empty or not provided
  const isEmpty = !data || data.length === 0;
  const chartData = isEmpty ? DEFAULT_MOCK_DATA : data;

  // When using mock data, use default keys regardless of what was passed
  const actualXDataKey = isEmpty ? 'x' : xDataKey;
  const actualYDataKey = isEmpty ? 'value' : yDataKey;

  // Calculate domain from data if not provided
  const calculatedDomain = React.useMemo(() => {
    if (yDomain) return yDomain;
    if (chartData.length === 0) return [0, 100];
    const values = chartData.map((d) => {
      const val = d[actualYDataKey];
      return typeof val === 'number' ? val : 0;
    });
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1; // 10% padding
    return [Math.max(0, min - padding), max + padding];
  }, [chartData, yDomain, actualYDataKey]);

  // Calculate ticks if not provided
  const calculatedTicks = React.useMemo(() => {
    if (yTicks) return yTicks;
    const [min, max] = calculatedDomain;
    const range = max - min;
    const step = range / 4; // 5 ticks total
    return Array.from({ length: 5 }, (_, i) => min + step * i);
  }, [calculatedDomain, yTicks]);

  // Chart tick color from theme
  const tickColor = colors.chart.tickColor;

  type TooltipPayload = {
    value: number;
    dataKey: string;
    payload: SingleLineChartDataPoint;
  };

  type CustomTooltipProps = TooltipProps<number, string> & {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
  };

  const CustomTooltip = (tooltipProps: CustomTooltipProps) => {
    const { active, payload } = tooltipProps;
    if (!active || !payload || !payload.length) return null;

    const value = payload[0]?.value as number;
    const formattedValue = tooltipFormatter
      ? tooltipFormatter(value, actualYDataKey)[0]
      : value.toString();

    return (
      <Box css={styles.tooltip}>
        <Box css={styles.tooltipValue}>{formattedValue}</Box>
      </Box>
    );
  };

  // Show blur overlay for loading or empty states
  const showOverlay = loading || isEmpty;

  const chartContent = (
    <Box
      css={[
        variant === 'withContainer' ? styles.chartContent : styles.chartContainer,
        showOverlay && styles.chartWrapper,
      ]}
    >
      {showOverlay && (
        <BlurOverlay
          absolute
          loading={loading}
          title={emptyTitle}
          text={emptyDescription}
          css={styles.blurOverlay}
        />
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={margin}>
          <XAxis
            dataKey={actualXDataKey}
            tick={{
              fill: tickColor,
            }}
            style={AXIS_TICK_STYLE}
            interval={xAxisInterval}
            tickMargin={16}
            axisLine={false}
            tickLine={false}
            tickFormatter={isEmpty ? undefined : xAxisLabelFormatter}
            padding={{ left: 20 }}
          />
          <YAxis
            orientation="right"
            tick={{
              fill: tickColor,
            }}
            style={Y_AXIS_TICK_STYLE}
            axisLine={false}
            tickLine={false}
            tickMargin={16}
            domain={calculatedDomain}
            ticks={calculatedTicks}
            tickFormatter={isEmpty ? undefined : yAxisLabelFormatter}
          />
          <Tooltip content={<CustomTooltip />} contentStyle={TOOLTIP_CONTENT_STYLE} />
          <Line
            type="monotone"
            dataKey={actualYDataKey}
            stroke={lineColor}
            strokeWidth={2}
            dot={showDots}
            activeDot={{ r: 4, fill: lineColor }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );

  if (variant === 'withContainer') {
    return (
      <Box css={styles.container}>
        {(title || icon || tooltipText) && (
          <Box css={styles.header}>
            {icon && <Icon name={icon} css={styles.headerIcon} />}
            {title && <Box css={styles.title}>{title}</Box>}
            {tooltipText && (
              <TooltipComponent title={tooltipText}>
                <Icon name="info" css={styles.tooltipIcon} />
              </TooltipComponent>
            )}
          </Box>
        )}
        {chartContent}
      </Box>
    );
  }

  return chartContent;
};

export default SingleLineChart;
