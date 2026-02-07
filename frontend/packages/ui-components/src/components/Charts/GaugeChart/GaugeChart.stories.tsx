import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import GaugeChart from './GaugeChart';

/**
 * GaugeChart is a reusable gauge/speedometer chart component for displaying scores or ratings.
 * It's built on top of Recharts RadialBarChart and provides a clean, customizable interface.
 */
const meta = {
  title: 'Components/Charts/GaugeChart',
  component: GaugeChart,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A reusable gauge chart component for displaying scores, ratings, or progress indicators. Features a semi-circular arc with color gradient and customizable indicator.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      description: 'Current value (0-100)',
      control: { type: 'number', min: 0, max: 100 },
    },
    label: {
      description: 'Label to display below the gauge',
      control: 'text',
    },
    status: {
      description: 'Status text to display below the label',
      control: 'text',
    },
    size: {
      description: 'Size of the chart in pixels',
      control: 'number',
      table: {
        defaultValue: { summary: '200' },
      },
    },
  },
} satisfies Meta<typeof GaugeChart>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic gauge chart with default settings
 */
export const Default: Story = {
  args: {
    value: 75,
    label: 'Score',
    status: 'Good',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that chart is rendered (Recharts renders SVG)
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check that label and status text are displayed
    expect(canvas.getByText('Score')).toBeInTheDocument();
    expect(canvas.getByText('Good')).toBeInTheDocument();
    
    // Check for gauge chart elements (path elements in SVG)
    const paths = svg?.querySelectorAll('path');
    expect(paths?.length).toBeGreaterThan(0);
  },
};

/**
 * Social Fraud gauge chart showing Twitter Score
 */
export const SocialFraud: Story = {
  args: {
    value: 75,
    label: 'Twitter Score',
    status: 'Good',
    size: 250,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check that label and status text are displayed
    expect(canvas.getByText('Twitter Score')).toBeInTheDocument();
    expect(canvas.getByText('Good')).toBeInTheDocument();
    
    // Verify ResponsiveContainer is present
    const responsiveContainer = canvasElement.querySelector('.recharts-responsive-container');
    expect(responsiveContainer).toBeInTheDocument();
  },
};

/**
 * Low score example
 */
export const LowScore: Story = {
  args: {
    value: 25,
    label: 'Risk Score',
    status: 'High Risk',
    size: 200,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check that label and status text are displayed
    expect(canvas.getByText('Risk Score')).toBeInTheDocument();
    expect(canvas.getByText('High Risk')).toBeInTheDocument();
  },
};

/**
 * High score example
 */
export const HighScore: Story = {
  args: {
    value: 95,
    label: 'Trust Score',
    status: 'Excellent',
    size: 200,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that chart is rendered
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    // Check that label and status text are displayed
    expect(canvas.getByText('Trust Score')).toBeInTheDocument();
    expect(canvas.getByText('Excellent')).toBeInTheDocument();
  },
};

