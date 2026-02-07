import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import BarChart from './BarChart';
import { colors } from '../../../theme/styleSystem';

/**
 * BarChart is a reusable bar chart component for displaying categorical data.
 * It's built on top of Recharts and provides a clean, customizable interface.
 */
const meta = {
  title: 'Components/Charts/BarChart',
  component: BarChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A reusable bar chart component for displaying categorical or time series data. Supports custom colors, domains, tooltips, and formatting.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: 'Array of data points with x (label) and value properties',
      control: 'object',
    },
    height: {
      description: 'Height of the chart in pixels',
      control: 'number',
      table: {
        defaultValue: { summary: '300' },
      },
    },
    barColor: {
      description: 'Color of the bars',
      control: 'color',
    },
    yDomain: {
      description: 'Y-axis domain [min, max]. Auto-calculated if not provided',
      control: 'object',
    },
    yTicks: {
      description: 'Custom Y-axis tick values. Auto-generated if not provided',
      control: 'object',
    },
  },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = [
  { x: 'Jan', value: 45 },
  { x: 'Feb', value: 52 },
  { x: 'Mar', value: 48 },
  { x: 'Apr', value: 61 },
  { x: 'May', value: 55 },
  { x: 'Jun', value: 67 },
];

/**
 * Basic bar chart with default settings
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
  },
};

/**
 * Chart with custom height
 */
export const CustomHeight: Story = {
  args: {
    data: sampleData,
    height: 400,
  },
  play: async ({ canvasElement }) => {    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Verify height is applied (check ResponsiveContainer)
    const responsiveContainer = canvasElement.querySelector('.recharts-responsive-container');
    expect(responsiveContainer).toBeInTheDocument();
  },
};

/**
 * Chart with custom bar color
 */
export const CustomColor: Story = {
  args: {
    data: sampleData,
    barColor: colors.semantic.success,
  },
  play: async ({ canvasElement }) => {
    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for bars (rect elements in SVG)
    const bars = svg?.querySelectorAll('rect');
    expect(bars?.length).toBeGreaterThan(0);
  },
};

/**
 * Chart with custom Y-axis domain
 */
export const CustomDomain: Story = {
  args: {
    data: sampleData,
    yDomain: [40, 70],
    yTicks: [40, 50, 60, 70],
  },
  play: async ({ canvasElement }) => {
    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for Y-axis labels (text elements)
    const textElements = svg?.querySelectorAll('text');
    expect(textElements?.length).toBeGreaterThan(0);
  },
};

/**
 * Liability vs Reserves chart showing percentage ratios from 2023 to 2025
 */
export const LiabilityVsReserves: Story = {
  args: {
    data: [
      { x: '2023', value: 103.2 },
      { x: 'Jul', value: 104.1 },
      { x: '2024', value: 104.8 },
      { x: 'Jul', value: 104.2 },
      { x: '2025', value: 104.6 },
      { x: 'Jul', value: 105.2 },
    ],
    barColor: colors.neutral.gray650,
    height: 300,
    yDomain: [102, 105],
    yTicks: [102, 103, 104, 105],
    yAxisLabelFormatter: (label) => `${label}%`,
    tooltipFormatter: (value) => [`${value.toFixed(1)}%`, 'Ratio'],
  },
  play: async ({ canvasElement }) => {
    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for X-axis labels (should include '2023', '2024', '2025')
    const textElements = svg?.querySelectorAll('text');
    const textContent = Array.from(textElements || []).map(el => el.textContent).join(' ');
    expect(textContent).toMatch(/2023|2024|2025/);
  },
};

