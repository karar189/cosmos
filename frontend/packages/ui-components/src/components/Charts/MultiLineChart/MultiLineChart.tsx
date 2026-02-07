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
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { colors, typographyValues, spacingValues, sizeNumberValues } from '../../../styleSystem';
import { ChartTooltip, type ChartTooltipItem } from '../ChartTooltip';
import * as styles from './MultiLineChart.styles';

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

export type MultiLineChartLine = {
  /** Unique key for this line */
  key: string;
  /** Display name for the legend */
  name: string;
  /** Color of the line */
  color: string;
  /** Data key in the data array */
  dataKey: string;
};

export type MultiLineChartDataPoint = {
  /** X-axis label (e.g., date, month, category) */
  x: string;
  /** Values for each line, keyed by the line's dataKey */
  [key: string]: string | number;
};

export type MultiLineChartProps = {
  /** Array of data points. Each point should have an 'x' property and values for each line's dataKey */
  data: MultiLineChartDataPoint[];
  /** Array of line configurations */
  lines: MultiLineChartLine[];
  /** Y-axis domain [min, max]. If not provided, will be calculated from data */
  yDomain?: [number, number];
  /** Custom Y-axis tick values. If not provided, will be auto-generated */
  yTicks?: number[];
  /** Height of the chart in pixels */
  height?: number;
  /** X-axis data key (default: 'x') */
  xDataKey?: string;
  /** Show legend */
  showLegend?: boolean;
  /** Legend position */
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  /** Custom tooltip content */
  customTooltip?: React.ComponentType<TooltipProps<number, string>>;
  /** Custom tooltip formatter */
  tooltipFormatter?: (value: number, name: string) => [string, string];
  /** Custom label formatter for X-axis */
  xAxisLabelFormatter?: (label: string) => string;
  /** Custom label formatter for Y-axis */
  yAxisLabelFormatter?: (label: string) => string;
  /** Show dots on lines */
  showDots?: boolean;
  /** Invert Y-axis (useful for risk scores where lower is better) */
  invertYAxis?: boolean;
  /** Custom margin for the chart */
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  /** X-axis tick interval. Use 'preserveStartEnd' for auto-spacing, or a number for fixed interval */
  xAxisInterval?:
    | number
    | 'preserveStart'
    | 'preserveEnd'
    | 'preserveStartEnd'
    | 'equidistantPreserveStart';
};

const MultiLineChart: React.FC<MultiLineChartProps> = (props) => {
  const {
    data,
    lines,
    yDomain,
    yTicks,
    height = 400,
    xDataKey = 'x',
    showLegend = true,
    legendPosition = 'bottom',
    customTooltip,
    tooltipFormatter,
    xAxisLabelFormatter,
    yAxisLabelFormatter,
    showDots = false,
    invertYAxis = false,
    margin = {
      top: 10,
      right: 0,
      left: 10,
      bottom: 0,
    },
    xAxisInterval = 'preserveStartEnd',
  } = props;

  // Calculate domain from data if not provided
  const calculatedDomain = React.useMemo(() => {
    if (yDomain) return yDomain;
    if (data.length === 0) return [0, 100];

    const allValues: number[] = [];
    data.forEach((point) => {
      lines.forEach((line) => {
        const value = point[line.dataKey];
        if (typeof value === 'number') {
          allValues.push(value);
        }
      });
    });

    if (allValues.length === 0) return [0, 100];

    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const padding = (max - min) * 0.1; // 10% padding
    return [Math.max(0, min - padding), max + padding];
  }, [data, lines, yDomain]);

  // Calculate ticks if not provided
  const calculatedTicks = React.useMemo(() => {
    if (yTicks) return yTicks;
    const [min, max] = calculatedDomain;
    const range = max - min;
    const step = range / 9; // 10 ticks total
    return Array.from({ length: 10 }, (_, i) => min + step * i);
  }, [calculatedDomain, yTicks]);

  // Chart tick color from theme
  const tickColor = colors.chart.tickColor;

  type TooltipPayload = {
    dataKey: string;
    value: number;
    payload: MultiLineChartDataPoint;
  };

  type CustomTooltipProps = TooltipProps<number, string> & {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
  };

  const DefaultTooltip = (tooltipProps: CustomTooltipProps) => {
    const { active, payload, label } = tooltipProps;
    if (!active || !payload || !payload.length) return null;

    // Format the label - if it's a month abbreviation, convert to full date format
    const formatDateLabel = (dateLabel: string | undefined): string => {
      if (!dateLabel) return '';

      // Month abbreviation to full date mapping (using current year and 15th as default)
      const monthMap: { [key: string]: string } = {
        Jan: 'Jan 15, 2025',
        Feb: 'Feb 15, 2025',
        Mar: 'Mar 15, 2025',
        Apr: 'Apr 15, 2025',
        May: 'May 15, 2025',
        Jun: 'Jun 15, 2025',
        Jul: 'Jul 15, 2025',
        Aug: 'Aug 15, 2025',
        Sep: 'Sep 15, 2025',
        Oct: 'Oct 15, 2025',
        Nov: 'Nov 15, 2025',
        Dec: 'Dec 15, 2025',
      };

      return monthMap[dateLabel] || dateLabel;
    };

    // Convert payload to ChartTooltipItem format
    const tooltipItems: ChartTooltipItem[] = payload
      .slice()
      .reverse()
      .reduce<ChartTooltipItem[]>((acc: ChartTooltipItem[], entry: TooltipPayload) => {
        const line = lines.find((line) => line.dataKey === entry.dataKey);
        if (!line) return acc;

        const value = entry.value as number;
        const formattedValue = tooltipFormatter
          ? tooltipFormatter(value, line.name)[0]
          : value.toString();

        acc.push({
          label: line.name,
          value: formattedValue,
          color: line.color,
        });
        return acc;
      }, []);

    return <ChartTooltip date={label} items={tooltipItems} dateFormatter={formatDateLabel} />;
  };

  const TooltipComponent = customTooltip || DefaultTooltip;

  const finalDomain = invertYAxis ? [calculatedDomain[1], calculatedDomain[0]] : calculatedDomain;

  return (
    <Box css={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={margin}>
          <XAxis
            dataKey={xDataKey}
            tick={{
              fill: tickColor,
            }}
            style={AXIS_TICK_STYLE}
            interval={xAxisInterval}
            tickMargin={8}
            padding={{ left: 0, right: 20 }}
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
            padding={{ top: 0, bottom: 20 }}
            tickLine={false}
            domain={finalDomain}
            ticks={calculatedTicks}
            tickFormatter={yAxisLabelFormatter}
          />
          <Tooltip
            content={<TooltipComponent />}
            cursor={{
              stroke: tickColor,
              strokeWidth: 1,
              strokeDasharray: '5 2',
            }}
          />
          {showLegend && (
            <Legend
              verticalAlign={
                legendPosition === 'top' || legendPosition === 'bottom' ? legendPosition : 'top'
              }
              align={
                legendPosition === 'left' || legendPosition === 'right' ? legendPosition : 'left'
              }
              wrapperStyle={{
                paddingTop: legendPosition === 'bottom' ? `${sizeNumberValues.xsm}px` : '0',
                marginLeft: `-${spacingValues.sm}`,
                textAlign: 'left',
                paddingLeft: '0',
                fontSize: typographyValues.fontSize.xs,
              }}
              iconType="circle"
              iconSize={sizeNumberValues.s}
              formatter={(value: string) => (
                <span style={{ color: colors.text.primary, marginRight: spacingValues.m }}>
                  {value}
                </span>
              )}
              style={{
                color: colors.text.primary,
              }}
            />
          )}
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.dataKey}
              stroke={line.color}
              strokeWidth={2}
              dot={showDots}
              name={line.name}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default MultiLineChart;
