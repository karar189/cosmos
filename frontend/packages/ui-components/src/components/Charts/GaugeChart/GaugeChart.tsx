/** @jsxImportSource @emotion/react */
'use client';

import React from 'react';
import { Box } from '@mui/material';
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import * as styles from './GaugeChart.styles';
import { colors } from '../../../theme/styleSystem';

export type GaugeChartProps = {
  /** Current value (0-100) */
  value: number;
  /** Label to display below the gauge */
  label?: string;
  /** Status text to display below the label */
  status?: string;
  /** Size of the chart in pixels */
  size?: number;
  /** Color of the indicator */
  indicatorColor?: string;
  /** Custom color stops for the gauge gradient */
  colorStops?: Array<{ offset: string; color: string }>;
};

/**
 * Interpolate between two hex colors based on a ratio
 */
function interpolateColor(color1: string, color2: string, ratio: number): string {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);
  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);
  const r = Math.round(r1 + (r2 - r1) * ratio);
  const g = Math.round(g1 + (g2 - g1) * ratio);
  const b = Math.round(b1 + (b2 - b1) * ratio);
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Get the interpolated color for a given value based on color stops
 */
function getColorForValue(val: number, stops: Array<{ offset: string; color: string }>): string {
  const position = val / 100;
  for (let i = 0; i < stops.length - 1; i++) {
    const currentOffset = parseFloat(stops[i].offset) / 100;
    const nextOffset = parseFloat(stops[i + 1].offset) / 100;
    if (position >= currentOffset && position <= nextOffset) {
      const ratio = (position - currentOffset) / (nextOffset - currentOffset);
      return interpolateColor(stops[i].color, stops[i + 1].color, ratio);
    }
  }
  return stops[stops.length - 1].color;
}

const GaugeChart: React.FC<GaugeChartProps> = (props) => {
  const {
    value,
    label = 'Score',
    status,
    size = 250,
    colorStops = [
      { offset: '0%', color: '#B51A18' },
      { offset: '17%', color: colors.semantic.alert },
      { offset: '38%', color: '#FFB675' },
      { offset: '68%', color: '#FFD665' },
      { offset: '90%', color: colors.semantic.success },
      { offset: '100%', color: colors.status.green },
    ],
  } = props;

  // Create data for the gauge background (100 segments for smooth gradient)
  const backgroundData = React.useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      value: 1,
      fill: getColorForValue(i, colorStops),
    }));
  }, [colorStops]);

  // Get color for the current value
  const currentIndicatorColor = React.useMemo(() => {
    return getColorForValue(value, colorStops);
  }, [value, colorStops]);

  // Calculate dimensions
  const innerRadius = size * 0.42; // Increased from 0.35 for thinner ring
  const outerRadius = size * 0.45; // Increased from 0.42 but gap is smaller
  const middleRadius = (innerRadius + outerRadius) / 2;
  const thickness = outerRadius - innerRadius;

  // Calculate indicator position on the arc
  const indicatorPosition = React.useMemo(() => {
    const RADIAN = Math.PI / 180;
    // Map value (0-100) to angle (180° to 0° for semi-circle)
    // Recharts Pie 180 is Left, 0 is Right (Counter-Clockwise: 180->90->0)
    const angle = 180 - (value / 100) * 180;
    const angleRad = angle * RADIAN;
    
    const cx = size / 2;
    const cy = size / 2; // Bottom of the semi-circle container
    
    // Recharts coordinates: 0 deg is Right (Positive X), 90 deg is Bottom (Positive Y)?? 
    // Actually Recharts standard: 0 is Right, 90 is Bottom, 180 is Left, 270 is Top.
    // But standard math: 0 is Right, 90 is Top.
    // In SVG/Screen coords: Y increases downwards.
    // So 0 deg (cos=1, sin=0) -> Right.
    // 90 deg (cos=0, sin=1) -> Bottom.
    // 180 deg (cos=-1, sin=0) -> Left.
    // 270 deg (cos=0, sin=-1) -> Top.
    
    // We want Top Half: 180 -> 270 -> 360(0).
    // Start 180 (Left), End 0 (Right).
    // Path goes 180 -> 270 (Top) -> 360/0 (Right).
    // Wait, if 270 is Top, then 180->0 Counter-clockwise goes through Bottom (90).
    // If we want Top Half, we need Clockwise 180 -> 0 (via 270/ -90).
    // Recharts Pie `startAngle={180} endAngle={0}` usually draws Top Half.
    // Let's assume 180 is Left, 0 is Right, and it goes via Top.
    
    // Trig for position (Top Half):
    // Angle is 180...0.
    // x = cx + r * cos(-angle)
    // y = cy + r * sin(-angle)
    // Since screen Y is down, Top is negative Y.
    // cos(180) = -1 (Left). sin(180) = 0.
    // cos(90) = 0. sin(90) = 1. (Bottom?)
    // We need sin to be negative for Top.
    // So we use -angle for math or just logic:
    // x = cx + r * cos(angle * RADIAN)
    // y = cy - r * sin(angle * RADIAN) 
    // (assuming angle is 0..180 standard math where 90 is up)
    
    // Correct math for 180->0 spanning top half:
    // angle goes from 180 down to 0.
    // x = cx + r * cos(angle_rad)
    // y = cy - r * sin(angle_rad)
    
    const xPos = cx + middleRadius * Math.cos(angleRad);
    const yPos = cy - middleRadius * Math.sin(angleRad);
    
    return { x: xPos, y: yPos };
  }, [value, size, middleRadius]);

  return (
    <Box css={styles.chartContainer} style={{ width: size, height: size / 2 + 60 }}>
      <Box css={styles.gaugeWrapper} style={{ width: size, height: size / 2 }}>
        <ResponsiveContainer width="100%" height="200%">
          <PieChart>
            <Pie
              data={backgroundData}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              startAngle={180}
              endAngle={0}
              dataKey="value"
              stroke="none"
              isAnimationActive={false}
            >
              {backgroundData.map((entry, index) => (
                <Cell key={`cell-bg-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Rounded End Caps */}
        <Box 
          css={styles.cap} 
          style={{ 
            left: size / 2 - middleRadius, 
            top: size / 2,
            width: thickness,
            height: thickness,
            backgroundColor: colorStops[0].color 
          }} 
        />
        <Box 
          css={styles.cap} 
          style={{ 
            left: size / 2 + middleRadius, 
            top: size / 2,
            width: thickness,
            height: thickness,
            backgroundColor: colorStops[colorStops.length - 1].color 
          }} 
        />

        {/* Circular indicator */}
        <Box
          css={styles.indicator}
          style={{
            left: `${indicatorPosition.x}px`,
            top: `${indicatorPosition.y}px`,
            backgroundColor: currentIndicatorColor,
          }}
        />
      </Box>
      <Box css={styles.labelContainer}>
        <Box css={styles.label}>{label}</Box>
        {status && <Box css={styles.status}>{status}</Box>}
      </Box>
    </Box>
  );
};

export default GaugeChart;
