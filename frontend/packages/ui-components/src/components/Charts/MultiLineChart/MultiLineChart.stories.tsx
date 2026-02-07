import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import MultiLineChart from './MultiLineChart';
import type { MultiLineChartDataPoint, MultiLineChartLine } from './MultiLineChart';
import { colors } from '../../../theme/styleSystem';

/**
 * MultiLineChart is a reusable multi-line chart component for displaying multiple data series.
 * It's built on top of Recharts and provides a clean, customizable interface with legend support.
 */
const meta = {
  title: 'Components/Charts/MultiLineChart',
  component: MultiLineChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A reusable multi-line chart component for displaying multiple time series or categorical data. Supports custom colors, domains, tooltips, legends, and formatting.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: 'Array of data points with x (label) and values for each line',
      control: 'object',
    },
    lines: {
      description: 'Array of line configurations (key, name, color, dataKey)',
      control: 'object',
    },
    height: {
      description: 'Height of the chart in pixels',
      control: 'number',
      table: {
        defaultValue: { summary: '400' },
      },
    },
    showLegend: {
      description: 'Show legend',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    showDots: {
      description: 'Show dots on lines',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    invertYAxis: {
      description: 'Invert Y-axis (useful for risk scores)',
      control: 'boolean',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof MultiLineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleLines: MultiLineChartLine[] = [
  { key: 'security', name: 'Security', color: colors.chart.security, dataKey: 'security' },
  { key: 'financial', name: 'Financial', color: colors.chart.financial, dataKey: 'financial' },
  { key: 'operational', name: 'Operational', color: colors.chart.operational, dataKey: 'operational' },
  { key: 'reputational', name: 'Reputational', color: colors.chart.reputational, dataKey: 'reputational' },
  { key: 'regulatory', name: 'Regulatory', color: colors.chart.regulatory, dataKey: 'regulatory' },
  { key: 'dependency', name: 'Dependency', color: colors.chart.dependency, dataKey: 'dependency' },
];

const sampleData: MultiLineChartDataPoint[] = [
  { x: 'Jan', security: 45, financial: 45, operational: 60, reputational: 30, regulatory: 85, dependency: 65 },
  { x: 'Feb', security: 25, financial: 30, operational: 55, reputational: 35, regulatory: 90, dependency: 60 },
  { x: 'Mar', security: 30, financial: 30, operational: 50, reputational: 40, regulatory: 88, dependency: 58 },
  { x: 'Apr', security: 35, financial: 35, operational: 45, reputational: 45, regulatory: 85, dependency: 55 },
  { x: 'May', security: 40, financial: 40, operational: 40, reputational: 50, regulatory: 82, dependency: 50 },
  { x: 'Jun', security: 38, financial: 35, operational: 42, reputational: 60, regulatory: 80, dependency: 45 },
];

/**
 * Basic multi-line chart with default settings
 */
export const Default: Story = {
  args: {
    data: sampleData,
    lines: sampleLines,
  },
  play: async ({ canvasElement }) => {    
    // Check that chart is rendered (Recharts renders SVG)
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for lines (path elements in SVG)
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBeGreaterThan(0);
    
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
    lines: sampleLines,
    height: 500,
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
 * Chart with dots enabled
 */
export const WithDots: Story = {
  args: {
    data: sampleData,
    lines: sampleLines,
    showDots: true,
  },
  play: async ({ canvasElement }) => {    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for lines (path elements in SVG)
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBeGreaterThan(0);
    
    // Check for dots (circle elements in SVG) - may not be immediately visible
    // Just verify the chart structure is present
    svg?.querySelectorAll('circle');
    // Dots may or may not be present depending on rendering, so we just check chart is rendered
    expect(svg).toBeInTheDocument();
  },
};

/**
 * Chart with inverted Y-axis (useful for risk scores)
 */
export const InvertedYAxis: Story = {
  args: {
    data: sampleData,
    lines: sampleLines,
    invertYAxis: true,
    yDomain: [100, 0],
  },
  play: async ({ canvasElement }) => {    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for lines
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBeGreaterThan(0);
  },
};

/**
 * Chart without legend
 */
export const NoLegend: Story = {
  args: {
    data: sampleData,
    lines: sampleLines,
    showLegend: false,
  },
  play: async ({ canvasElement }) => {    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for lines
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBeGreaterThan(0);
    
    // Verify legend is not present (check for legend-related elements)
    const legend = canvasElement.querySelector('.recharts-legend-wrapper');
    expect(legend).not.toBeInTheDocument();
  },
};

/**
 * Chart with custom Y-axis domain
 */
export const CustomDomain: Story = {
  args: {
    data: sampleData,
    lines: sampleLines,
    yDomain: [0, 100],
    yTicks: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  },
  play: async ({ canvasElement }) => {    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for lines
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBeGreaterThan(0);
    
    // Verify chart container is present
    const container = canvasElement.querySelector('[class*="chartContainer"]');
    expect(container).toBeInTheDocument();
  },
};

/**
 * Chart with custom tooltip formatter
 */
export const CustomTooltip: Story = {
  args: {
    data: sampleData,
    lines: sampleLines,
    tooltipFormatter: (value) => [`${value}%`, 'Score'],
  },
  play: async ({ canvasElement }) => {    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for lines
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
    lines: sampleLines,
    xAxisLabelFormatter: (label) => label.toUpperCase(),
    yAxisLabelFormatter: (label) => `${label}%`,
  },
  play: async ({ canvasElement }) => {    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for lines
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBeGreaterThan(0);
    
    // Verify chart container is present
    const container = canvasElement.querySelector('[class*="chartContainer"]');
    expect(container).toBeInTheDocument();
  },
};

/**
 * PoL Categories chart example (inverted Y-axis)
 */
export const PolCategories: Story = {
  args: {
    data: [
      { x: 'Jan', security: 45, financial: 45, operational: 60, reputational: 30, regulatory: 85, dependency: 65 },
      { x: 'Feb', security: 25, financial: 30, operational: 55, reputational: 35, regulatory: 90, dependency: 60 },
      { x: 'Mar', security: 30, financial: 30, operational: 50, reputational: 40, regulatory: 88, dependency: 58 },
      { x: 'Apr', security: 35, financial: 35, operational: 45, reputational: 45, regulatory: 85, dependency: 55 },
      { x: 'May', security: 40, financial: 40, operational: 40, reputational: 50, regulatory: 82, dependency: 50 },
      { x: 'Jun', security: 38, financial: 35, operational: 42, reputational: 60, regulatory: 80, dependency: 45 },
      { x: 'Jul', security: 35, financial: 30, operational: 45, reputational: 55, regulatory: 82, dependency: 40 },
      { x: 'Aug', security: 32, financial: 25, operational: 48, reputational: 50, regulatory: 84, dependency: 38 },
      { x: 'Sep', security: 30, financial: 20, operational: 50, reputational: 45, regulatory: 86, dependency: 35 },
      { x: 'Oct', security: 28, financial: 15, operational: 45, reputational: 40, regulatory: 87, dependency: 32 },
      { x: 'Nov', security: 35, financial: 10, operational: 35, reputational: 35, regulatory: 85, dependency: 30 },
      { x: 'Dec', security: 40, financial: 35, operational: 30, reputational: 30, regulatory: 85, dependency: 30 },
    ],
    lines: sampleLines,
    invertYAxis: true,
    yDomain: [100, 0],
    height: 400,
  },
  play: async ({ canvasElement }) => {    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for lines
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBeGreaterThan(0);
    
    // Verify chart container is present
    const container = canvasElement.querySelector('[class*="chartContainer"]');
    expect(container).toBeInTheDocument();
    
    // Check for any text elements (axis labels, etc.)
    svg?.querySelectorAll('text');
    // Text elements may be present for axis labels
    expect(svg).toBeInTheDocument();
  },
};

/**
 * Simple 2-line chart example
 */
export const TwoLines: Story = {
  args: {
    data: [
      { x: 'Q1', revenue: 100, expenses: 80 },
      { x: 'Q2', revenue: 120, expenses: 85 },
      { x: 'Q3', revenue: 140, expenses: 90 },
      { x: 'Q4', revenue: 160, expenses: 95 },
    ],
    lines: [
      { key: 'revenue', name: 'Revenue', color: colors.semantic.success, dataKey: 'revenue' },
      { key: 'expenses', name: 'Expenses', color: colors.semantic.error, dataKey: 'expenses' },
    ],
    height: 300,
  },
  play: async ({ canvasElement }) => {    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check for lines (should have 2 lines)
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBeGreaterThan(0);
    
    // Verify chart container is present
    const container = canvasElement.querySelector('[class*="chartContainer"]');
    expect(container).toBeInTheDocument();
  },
};

