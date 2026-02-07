import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import SingleLineChart from './SingleLineChart';
import { colors } from '../../../theme/styleSystem';

/**
 * SingleLineChart is a reusable line chart component for displaying single data series.
 * It's built on top of Recharts and provides a clean, customizable interface.
 */
const meta = {
  title: 'Components/Charts/SingleLineChart',
  component: SingleLineChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A reusable single-line chart component for displaying time series or categorical data. Supports custom colors, domains, tooltips, and formatting.',
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
    lineColor: {
      description: 'Color of the line',
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
    showDots: {
      description: 'Show dots on the line',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof SingleLineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = [
  { x: 'Mar 3', value: 60 },
  { x: 'Mar 4', value: 70 },
  { x: 'Mar 5', value: 73 },
  { x: 'Mar 6', value: 66 },
  { x: 'Mar 7', value: 72 },
  { x: 'Mar 8', value: 75 },
];

/**
 * Basic single line chart with default settings
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
    
    // Check for line (path elements in SVG)
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBeGreaterThan(0);
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
    
    // Verify ResponsiveContainer is present
    const responsiveContainer = canvasElement.querySelector('.recharts-responsive-container');
    expect(responsiveContainer).toBeInTheDocument();
  },
};

/**
 * Chart with custom line color
 */
export const CustomColor: Story = {
  args: {
    data: sampleData,
    lineColor: colors.semantic.success,
  },
  play: async ({ canvasElement }) => {    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for line (path elements in SVG)
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBeGreaterThan(0);
  },
};

/**
 * Chart with dots enabled
 */
export const WithDots: Story = {
  args: {
    data: sampleData,
    showDots: true,
  },
  play: async ({ canvasElement }) => {    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for line (path elements in SVG)
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBeGreaterThan(0);
  },
};

/**
 * Chart with custom Y-axis domain
 */
export const CustomDomain: Story = {
  args: {
    data: sampleData,
    yDomain: [55, 80],
    yTicks: [60, 65, 70, 75],
  },
  play: async ({ canvasElement }) => {
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for line
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBeGreaterThan(0);
  },
};

/**
 * Chart with custom tooltip formatter
 */
export const CustomTooltip: Story = {
  args: {
    data: sampleData,
    tooltipFormatter: (value) => [`$${value.toFixed(2)}`, 'Price'],
  },
  play: async ({ canvasElement }) => {    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for line
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBeGreaterThan(0);
  },
};

/**
 * Chart with custom axis label formatters
 */
export const CustomFormatters: Story = {
  args: {
    data: sampleData,
    xAxisLabelFormatter: (label) => label.toUpperCase(),
    yAxisLabelFormatter: (label) => `$${label}`,
  },
  play: async ({ canvasElement }) => {    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for line
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBeGreaterThan(0);
  },
};

/**
 * Price chart example
 */
export const PriceChart: Story = {
  args: {
    data: [
      { x: 'Jan', value: 45 },
      { x: 'Feb', value: 52 },
      { x: 'Mar', value: 48 },
      { x: 'Apr', value: 61 },
      { x: 'May', value: 55 },
      { x: 'Jun', value: 67 },
    ],
    lineColor: colors.text.primary,
    height: 300,
    yDomain: [40, 70],
  },
  play: async ({ canvasElement }) => {    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for line
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBeGreaterThan(0);
  },
};

/**
 * Market cap chart example
 */
export const MarketCapChart: Story = {
  args: {
    data: [
      { x: 'Jan', value: 580 },
      { x: 'Feb', value: 680 },
      { x: 'Mar', value: 710 },
      { x: 'Apr', value: 640 },
      { x: 'May', value: 700 },
      { x: 'Jun', value: 730 },
    ],
    lineColor: colors.semantic.success,
    height: 300,
    tooltipFormatter: (value) => [`$${value.toLocaleString()}M`, 'Market Cap'],
  },
  play: async ({ canvasElement }) => {    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for line
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBeGreaterThan(0);
  },
};

/**
 * Inflation chart showing annual inflation rate from 2023 to 2025
 */
export const InflationChart: Story = {
  args: {
    data: [
      { x: '2023', value: 5.2 },
      { x: 'Jul', value: 7.5 },
      { x: '2024', value: 7.0 },
      { x: 'Jul', value: 8.5 },
      { x: '2025', value: 6.8 },
      { x: 'Jul', value: 9.8 },
    ],
    lineColor: colors.text.primary,
    height: 300,
    yDomain: [5, 10],
    yTicks: [5, 6, 7, 8, 10],
    yAxisLabelFormatter: (label) => `${label}%`,
    tooltipFormatter: (value) => [`${value.toFixed(1)}%`, 'Annual Inflation'],
  },
  play: async ({ canvasElement }) => {
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for line
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBeGreaterThan(0);
  },
};

/**
 * TVL (Total Value Locked) chart showing values from 2023 to 2025
 */
export const TVLChart: Story = {
  args: {
    data: [
      { x: '2023', value: 610 },
      { x: 'Jul', value: 860 },
      { x: '2024', value: 895 },
      { x: 'Jul', value: 790 },
      { x: '2025', value: 920 },
      { x: 'Jul', value: 980 },
    ],
    lineColor: colors.text.primary,
    height: 300,
    yDomain: [600, 1000],
    yTicks: [600, 700, 800, 900, 1000],
    yAxisLabelFormatter: (label) => {
      const num = Number(label);
      if (num >= 1000) return '1B';
      return `${num}M`;
    },
    tooltipFormatter: (value) => {
      const formatted = value >= 1000 ? `${(value / 1000).toFixed(2)}B` : `${value}M`;
      return [`$${formatted}`, 'TVL'];
    },
  },
  play: async ({ canvasElement }) => {    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for line
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBeGreaterThan(0);
  },
};

/**
 * Active Addresses chart showing daily active addresses from March 3-8
 */
export const ActiveAddressesChart: Story = {
  args: {
    data: [
      { x: 'Mar 3', value: 580 },
      { x: 'Mar 4', value: 880 },
      { x: 'Mar 5', value: 920 },
      { x: 'Mar 6', value: 780 },
      { x: 'Mar 7', value: 910 },
      { x: 'Mar 8', value: 980 },
    ],
    lineColor: colors.text.primary,
    height: 300,
    yDomain: [600, 1000],
    yTicks: [600, 700, 800, 900, 1000],
    yAxisLabelFormatter: (label) => {
      const num = Number(label);
      if (num >= 1000) return '1M';
      return `${num}K`;
    },
    tooltipFormatter: (value) => {
      const formatted = value >= 1000 ? `${(value / 1000).toFixed(2)}M` : `${value}K`;
      return [formatted, 'Active Addresses'];
    },
  },
  play: async ({ canvasElement }) => {    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for line
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBeGreaterThan(0);
  },
};

/**
 * Chart with container variant - includes title, icon, and tooltip
 */
export const WithContainer: Story = {
  args: {
    variant: 'withContainer',
    title: 'PoL Dynamic',
    tooltipText: 'Probability of Loss dynamic trend over time',
    data: sampleData,
    height: 140,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for title text
    expect(canvas.getByText('PoL Dynamic')).toBeInTheDocument();
    
    // Check for line
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBeGreaterThan(0);
  },
};

/**
 * Chart with container variant including icon
 */
export const WithContainerAndIcon: Story = {
  args: {
    variant: 'withContainer',
    title: 'Price Performance',
    icon: 'activity',
    tooltipText: 'Historical price data for the last 30 days',
    data: sampleData,
    height: 140,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for title text
    expect(canvas.getByText('Price Performance')).toBeInTheDocument();
    
    // Check for icon (Icon component renders an SVG)
    const svgs = canvasElement.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
    
    // Check for line
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBeGreaterThan(0);
  },
};

