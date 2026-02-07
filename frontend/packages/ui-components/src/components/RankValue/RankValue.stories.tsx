import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import RankValue from './RankValue';

/**
 * RankValue displays a numeric value out of a maximum in a simple format (e.g., "45/100").
 *
 * Use it to show scores, ratings, or any numeric ratio.
 */
const meta = {
  title: 'Components/RankValue',
  component: RankValue,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'RankValue component displays a numeric value out of a maximum in a simple format. Perfect for showing scores or ratings in a compact way.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'number',
      description: 'The numeric value to display',
    },
    maxValue: {
      control: 'number',
      description: 'The maximum value',
    },
  },
} satisfies Meta<typeof RankValue>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic rank value
 */
export const Default: Story = {
  args: {
    value: 45,
    maxValue: 100,
  },
  /**
   * Interaction test:
   * - Renders "45/100" format
   * - Both value and maxValue displayed
   * - Correct separator (/)
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check the full text
    const rankValue = canvas.getByText('45/100');
    expect(rankValue).toBeInTheDocument();
  },
};

/**
 * Rank value with small numbers
 */
export const SmallValues: Story = {
  args: {
    value: 8,
    maxValue: 10,
  },
  /**
   * Interaction test:
   * - Renders small numbers correctly
   * - Shows "8/10"
   * - Format maintained for small values
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const rankValue = canvas.getByText('8/10');
    expect(rankValue).toBeInTheDocument();
  },
};

/**
 * Rank value with large numbers
 */
export const LargeValues: Story = {
  args: {
    value: 850,
    maxValue: 1000,
  },
  /**
   * Interaction test:
   * - Handles large numbers
   * - Shows "850/1000"
   * - No formatting issues with larger values
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const rankValue = canvas.getByText('850/1000');
    expect(rankValue).toBeInTheDocument();
  },
};

/**
 * Perfect score
 */
export const PerfectScore: Story = {
  args: {
    value: 100,
    maxValue: 100,
  },
  /**
   * Interaction test:
   * - Perfect score (value equals maxValue)
   * - Shows "100/100"
   * - Displays correctly when equal
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const rankValue = canvas.getByText('100/100');
    expect(rankValue).toBeInTheDocument();
  },
};

/**
 * Zero value
 */
export const ZeroValue: Story = {
  args: {
    value: 0,
    maxValue: 100,
  },
  /**
   * Interaction test:
   * - Zero value displayed
   * - Shows "0/100"
   * - Handles minimum value correctly
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const rankValue = canvas.getByText('0/100');
    expect(rankValue).toBeInTheDocument();
  },
};