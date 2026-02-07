import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import ComboChart from './ComboChart';
import { colors } from '../../../theme/styleSystem';

/**
 * ComboChart is a reusable combination chart component for displaying both line and bar data.
 * It's built on top of Recharts ComposedChart and provides a clean, customizable interface.
 */
const meta = {
  title: 'Components/Charts/ComboChart',
  component: ComboChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A reusable combination chart component for displaying both line and bar data on the same chart. Supports separate Y-axes for line and bar data.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: 'Array of data points with x (label), lineValue, and barValue properties',
      control: 'object',
    },
    height: {
      description: 'Height of the chart in pixels',
      control: 'number',
      table: {
        defaultValue: { summary: '300' },
      },
    },
    lineColor: {
      description: 'Color of the line',
      control: 'color',
    },
    barColor: {
      description: 'Color of the bars',
      control: 'color',
    },
  },
} satisfies Meta<typeof ComboChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = [
  { x: 'Jan', lineValue: 45, barValue: 120 },
  { x: 'Feb', lineValue: 52, barValue: 150 },
  { x: 'Mar', lineValue: 48, barValue: 130 },
  { x: 'Apr', lineValue: 61, barValue: 180 },
  { x: 'May', lineValue: 55, barValue: 160 },
  { x: 'Jun', lineValue: 67, barValue: 200 },
];

/**
 * Basic combo chart with default settings
 */
export const Default: Story = {
  args: {
    data: sampleData,
  },
  play: async ({ canvasElement }) => {   
    // Check that chart is rendered (Recharts renders SVG)
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check that chart container is present
    const container = canvasElement.querySelector('[class*="chartContainer"]');
    expect(container).toBeInTheDocument();
    
    // Check for both bars and line (rect for bars, path for line)
    const bars = svg?.querySelectorAll('rect');
    const lines = svg?.querySelectorAll('path');
    expect(bars?.length).toBeGreaterThan(0);
    expect(lines?.length).toBeGreaterThan(0);
  },
};

/**
 * Washtrading chart showing CEX Holdings (line) vs Volume (bars)
 */
export const Washtrading: Story = {
  args: {
    data: [
      { x: 'Mar 3', lineValue: 60, barValue: 120 },
      { x: 'Mar 4', lineValue: 75, barValue: 150 },
      { x: 'Mar 5', lineValue: 85, barValue: 200 },
      { x: 'Mar 6', lineValue: 50, barValue: 80 },
      { x: 'Mar 7', lineValue: 90, barValue: 180 },
      { x: 'Mar 8', lineValue: 95, barValue: 140 },
    ],
    lineColor: colors.text.primary,
    barColor: colors.neutral.gray300,
    height: 300,
    lineYDomain: [40, 100],
    barYDomain: [0, 250],
    tooltipFormatter: (value, name, dataKey) => {
      if (dataKey === 'lineValue') {
        return [`${value}`, 'CEX Holdings'];
      }
      return [`${value}`, 'Volume'];
    },
  },
  play: async ({ canvasElement }) => {    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for X-axis labels (should include 'Mar 3', 'Mar 4', etc.)
    const textElements = svg?.querySelectorAll('text');
    const textContent = Array.from(textElements || []).map(el => el.textContent).join(' ');
    expect(textContent).toMatch(/Mar/);
    
    // Check for both bars and line
    const bars = svg?.querySelectorAll('rect');
    const lines = svg?.querySelectorAll('path');
    expect(bars?.length).toBeGreaterThan(0);
    expect(lines?.length).toBeGreaterThan(0);
  },
};

