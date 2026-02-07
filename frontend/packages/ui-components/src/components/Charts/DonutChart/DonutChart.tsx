/** @jsxImportSource @emotion/react */
'use client';

import { Box } from '@mui/material';
import { colors } from '@core3/ui-components/styleSystem';
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, TooltipProps } from 'recharts';
import * as styles from './DonutChart.styles';

export type DonutChartDataPoint = {
  /** Name/label for this segment */
  name: string;
  /** Value for this segment */
  value: number;
  /** Color for this segment (optional, will use default colors if not provided) */
  color?: string;
};

export type DonutChartProps = {
  /** Array of data points to display */
  data: DonutChartDataPoint[];
  /** Inner radius of the donut (as a percentage or number) */
  innerRadius?: number | string;
  /** Outer radius of the donut (as a percentage or number) */
  outerRadius?: number | string;
  /** Width/height of the chart container */
  size?: number;
  /** Custom tooltip formatter */
  tooltipFormatter?: (value: number, name: string) => [string, string];
  /** Show percentage in tooltip */
  showPercentage?: boolean;
};
export const defaultColors = Object.values(colors.donutChart);

const DonutChart: React.FC<DonutChartProps> = (props) => {
  const {
    data,
    innerRadius = '65%',
    outerRadius = '90%',
    size = 200,
    tooltipFormatter,
    showPercentage = true,
  } = props;

  const total = React.useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);

  type TooltipPayload = {
    name: string;
    value: number;
    color?: string;
    payload: DonutChartDataPoint;
  };

  type CustomTooltipProps = TooltipProps<number, string> & {
    active?: boolean;
    payload?: TooltipPayload[];
    label?: string;
  };

  const CustomTooltip = (tooltipProps: CustomTooltipProps) => {
    const { active, payload } = tooltipProps;
    if (!active || !payload || !payload.length) return null;

    const entry = payload[0];
    const value = entry.value as number;
    const name = entry.name || '';
    const percentage = showPercentage ? ((value / total) * 100).toFixed(0) : null;

    const formattedValue = tooltipFormatter ? tooltipFormatter(value, name)[0] : value.toString();
    const formattedLabel = tooltipFormatter ? tooltipFormatter(value, name)[1] : name;

    return (
      <Box css={styles.tooltip}>
        <Box css={styles.tooltipItem}>
          <Box css={styles.tooltipDot} style={{ backgroundColor: entry.color }} />
          <Box css={styles.tooltipLabel}>{formattedLabel}</Box>
          <Box css={styles.tooltipValue}>
            {formattedValue}
            {percentage && ` (${percentage}%)`}
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box css={styles.chartContainer} style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={0}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || defaultColors[index % defaultColors.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default DonutChart;
