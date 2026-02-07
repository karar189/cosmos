import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import ProgressBar from './ProgressBar';
import React from 'react';

/**
 * ProgressBar displays progress as a colored bar with optional label.
 * It supports multiple colors, sizes, and label formats.
 */
const meta = {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A progress bar component for visualizing completion status. Features color-coded variants, different sizes, and flexible label formatting (fraction or percentage).',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Current value (0-100)',
    },
    max: {
      control: { type: 'number', min: 1 },
      description: 'Maximum value',
      table: {
        defaultValue: { summary: '100' },
      },
    },
    color: {
      control: 'select',
      options: ['default', 'green', 'yellow', 'orange', 'red'],
      description: 'Color of the progress bar',
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the progress bar',
      table: {
        defaultValue: { summary: 'medium' },
      },
    },
    labelStyle: {
      control: 'select',
      options: ['fraction', 'percentage'],
      description: 'Label format style',
      table: {
        defaultValue: { summary: 'fraction' },
      },
    },
    showLabel: {
      control: 'boolean',
      description: 'Whether to show label',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default progress bar without label
 */
export const Default: Story = {
  args: {
    value: 50,
    max: 100,
  },
  /**
   * Interaction test:
   * - Renders progressbar with correct role
   * - Has proper ARIA attributes
   * - No label displayed
   * - Progress bar shows 50% width
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const progressbar = canvas.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
    
    // Check ARIA attributes
    expect(progressbar).toHaveAttribute('aria-valuenow', '50');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
    
    // Check width is 50%
    expect(progressbar).toHaveAttribute('style', 'width: 50%;');
  },
};

/**
 * Progress bar with fraction label (5/100)
 */
export const WithFractionLabel: Story = {
  args: {
    value: 5,
    max: 100,
    showLabel: true,
    labelStyle: 'fraction',
  },
  /**
   * Interaction test:
   * - Shows fraction label format
   * - Displays "5/100"
   * - Progress bar reflects 5% width
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const progressbar = canvas.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '5');
    
    // Check fraction label is displayed
    expect(canvas.getByText('5')).toBeInTheDocument();
    expect(canvas.getByText('/100')).toBeInTheDocument();
    
    // Check width is 5%
    expect(progressbar).toHaveAttribute('style', 'width: 5%;');
  },
};

/**
 * Progress bar with percentage label (50%)
 */
export const WithPercentageLabel: Story = {
  args: {
    value: 50,
    max: 100,
    showLabel: true,
    labelStyle: 'percentage',
  },
  /**
   * Interaction test:
   * - Shows percentage label format
   * - Displays "50%"
   * - Progress bar shows correct width
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const progressbar = canvas.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '50');
    
    // Check percentage label
    expect(canvas.getByText('50%')).toBeInTheDocument();
    
    // Check width is 50%
    expect(progressbar).toHaveAttribute('style', 'width: 50%;');
  },
};

/**
 * Green progress bar - success state
 */
export const Green: Story = {
  args: {
    value: 80,
    color: 'green',
    showLabel: true,
    labelStyle: 'percentage',
  },
  /**
   * Interaction test:
   * - Green color applied
   * - Shows 80%
   * - Correct ARIA values
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const progressbar = canvas.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '80');
    expect(canvas.getByText('80%')).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('style', 'width: 80%;');
  },
};

/**
 * Yellow progress bar - warning state
 */
export const Yellow: Story = {
  args: {
    value: 60,
    color: 'yellow',
    showLabel: true,
    labelStyle: 'percentage',
  },
  /**
   * Interaction test:
   * - Yellow color variant
   * - Shows 60%
   * - Correct progress width
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const progressbar = canvas.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '60');
    expect(canvas.getByText('60%')).toBeInTheDocument();
  },
};

/**
 * Orange progress bar - caution state
 */
export const Orange: Story = {
  args: {
    value: 40,
    color: 'orange',
    showLabel: true,
    labelStyle: 'percentage',
  },
  /**
   * Interaction test:
   * - Orange color variant
   * - Shows 40%
   * - Correct ARIA attributes
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const progressbar = canvas.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '40');
    expect(canvas.getByText('40%')).toBeInTheDocument();
  },
};

/**
 * Red progress bar - error/critical state
 */
export const Red: Story = {
  args: {
    value: 20,
    color: 'red',
    showLabel: true,
    labelStyle: 'percentage',
  },
  /**
   * Interaction test:
   * - Red color variant
   * - Shows 20%
   * - Low progress visualization
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const progressbar = canvas.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '20');
    expect(canvas.getByText('20%')).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('style', 'width: 20%;');
  },
};

/**
 * Small size
 */
export const Small: Story = {
  args: {
    value: 50,
    size: 'small',
    showLabel: true,
  },
  /**
   * Interaction test:
   * - Small size variant
   * - Progress bar rendered correctly
   * - Label displayed with fraction format
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const progressbar = canvas.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('aria-valuenow', '50');
  },
};

/**
 * Medium size (default)
 */
export const Medium: Story = {
  args: {
    value: 50,
    size: 'medium',
    showLabel: true,
  },
  /**
   * Interaction test:
   * - Medium size (default)
   * - Progress bar rendered
   * - Label displayed
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const progressbar = canvas.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('aria-valuenow', '50');
  },
};

/**
 * Large size
 */
export const Large: Story = {
  args: {
    value: 50,
    size: 'large',
    showLabel: true,
  },
  /**
   * Interaction test:
   * - Large size variant
   * - Progress bar displayed correctly
   * - ARIA attributes present
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const progressbar = canvas.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('aria-valuenow', '50');
  },
};

/**
 * Empty progress (0%)
 */
export const Empty: Story = {
  args: {
    value: 0,
    max: 100,
    showLabel: true,
    labelStyle: 'percentage',
  },
  /**
   * Interaction test:
   * - Shows 0%
   * - Progress bar width is 0%
   * - ARIA value is 0
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const progressbar = canvas.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '0');
    expect(canvas.getByText('0%')).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('style', 'width: 0%;');
  },
};

/**
 * Full progress (100%)
 */
export const Full: Story = {
  args: {
    value: 100,
    max: 100,
    color: 'green',
    showLabel: true,
    labelStyle: 'percentage',
  },
  /**
   * Interaction test:
   * - Shows 100%
   * - Progress bar width is 100%
   * - Complete state
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const progressbar = canvas.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '100');
    expect(canvas.getByText('100%')).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('style', 'width: 100%;');
  },
};

/**
 * Custom max value
 */
export const CustomMax: Story = {
  args: {
    value: 15,
    max: 50,
    showLabel: true,
    labelStyle: 'fraction',
  },
  /**
   * Interaction test:
   * - Custom max of 50
   * - Shows "15/50"
   * - Calculates percentage correctly (30%)
   * - ARIA valuemax is 50
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const progressbar = canvas.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '15');
    expect(progressbar).toHaveAttribute('aria-valuemax', '50');
    
    // Check fraction label
    expect(canvas.getByText('15')).toBeInTheDocument();
    expect(canvas.getByText('/50')).toBeInTheDocument();
    
    // 15/50 = 30%
    expect(progressbar).toHaveAttribute('style', 'width: 30%;');
  },
};

/**
 * All colors comparison
 */
export const AllColors: Story = {
  args: {
    value: 50,
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '200px' }}>
      <ProgressBar value={50} color="default" showLabel labelStyle="percentage" />
      <ProgressBar value={50} color="green" showLabel labelStyle="percentage" />
      <ProgressBar value={50} color="yellow" showLabel labelStyle="percentage" />
      <ProgressBar value={50} color="orange" showLabel labelStyle="percentage" />
      <ProgressBar value={50} color="red" showLabel labelStyle="percentage" />
    </div>
  ),
  /**
   * Interaction test:
   * - Renders all 5 color variants
   * - All show 50%
   * - Each has correct ARIA attributes
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const progressbars = canvas.getAllByRole('progressbar');
    expect(progressbars).toHaveLength(5);
    
    // All should have value 50
    progressbars.forEach(bar => {
      expect(bar).toHaveAttribute('aria-valuenow', '50');
      expect(bar).toHaveAttribute('style', 'width: 50%;');
    });
    
    // All should show 50% label
    const labels = canvas.getAllByText('50%');
    expect(labels).toHaveLength(5);
  },
};

/**
 * All sizes comparison
 */
export const AllSizes: Story = {
  args: {
    value: 50,
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '200px' }}>
      <ProgressBar value={50} size="small" showLabel labelStyle="percentage" />
      <ProgressBar value={50} size="medium" showLabel labelStyle="percentage" />
      <ProgressBar value={50} size="large" showLabel labelStyle="percentage" />
    </div>
  ),
  /**
   * Interaction test:
   * - Renders all 3 sizes
   * - All show 50%
   * - Different heights but same value
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const progressbars = canvas.getAllByRole('progressbar');
    expect(progressbars).toHaveLength(3);
    
    // All should have value 50
    progressbars.forEach(bar => {
      expect(bar).toHaveAttribute('aria-valuenow', '50');
      expect(bar).toHaveAttribute('style', 'width: 50%;');
    });
    
    const labels = canvas.getAllByText('50%');
    expect(labels).toHaveLength(3);
  },
};

/**
 * Label formats comparison
 */
export const LabelFormats: Story = {
  args: {
    value: 35,
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '200px' }}>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Fraction format:</p>
        <ProgressBar value={35} max={100} showLabel labelStyle="fraction" />
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontSize: '12px', color: '#666' }}>Percentage format:</p>
        <ProgressBar value={35} max={100} showLabel labelStyle="percentage" />
      </div>
    </div>
  ),
  /**
   * Interaction test:
   * - Two progress bars with different label formats
   * - Fraction shows "35/100"
   * - Percentage shows "35%"
   * - Both have same width (35%)
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const progressbars = canvas.getAllByRole('progressbar');
    expect(progressbars).toHaveLength(2);
    
    // Both should have same value and width
    progressbars.forEach(bar => {
      expect(bar).toHaveAttribute('aria-valuenow', '35');
      expect(bar).toHaveAttribute('style', 'width: 35%;');
    });
    
    // Check fraction label
    expect(canvas.getByText('35')).toBeInTheDocument();
    expect(canvas.getByText('/100')).toBeInTheDocument();
    
    // Check percentage label
    expect(canvas.getByText('35%')).toBeInTheDocument();
  },
};
