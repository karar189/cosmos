import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import DonutChart from './DonutChart';
import { colors } from '../../../theme/styleSystem';

/**
 * DonutChart is a reusable donut/pie chart component for displaying categorical data.
 * It's built on top of Recharts PieChart and provides a clean, customizable interface.
 */
const meta = {
  title: 'Components/Charts/DonutChart',
  component: DonutChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A reusable donut chart component for displaying categorical or proportional data. Supports custom colors, sizes, and tooltips.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: 'Array of data points with name and value properties',
      control: 'object',
    },
    size: {
      description: 'Width/height of the chart in pixels',
      control: 'number',
      table: {
        defaultValue: { summary: '200' },
      },
    },
    innerRadius: {
      description: 'Inner radius of the donut (percentage or number)',
      control: 'text',
      table: {
        defaultValue: { summary: "'60%'" },
      },
    },
    outerRadius: {
      description: 'Outer radius of the donut (percentage or number)',
      control: 'text',
      table: {
        defaultValue: { summary: "'90%'" },
      },
    },
  },
} satisfies Meta<typeof DonutChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = [
  { name: 'Category A', value: 40 },
  { name: 'Category B', value: 30 },
  { name: 'Category C', value: 20 },
  { name: 'Category D', value: 10 },
];

/**
 * Basic donut chart with default settings
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
    
    // Verify ResponsiveContainer is present
    const responsiveContainer = canvasElement.querySelector('.recharts-responsive-container');
    expect(responsiveContainer).toBeInTheDocument();
  },
};

/**
 * Asset Distribution chart showing Stable, Native, and Project percentages
 */
export const AssetDistribution: Story = {
  args: {
    data: [
      { name: 'Stable', value: 65, color: colors.chart.dependency },
      { name: 'Native', value: 23, color: colors.chart.reputational },
      { name: 'Project', value: 12, color: colors.chart.operational },
    ],
    size: 200,
    innerRadius: '60%',
    outerRadius: '90%',
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

