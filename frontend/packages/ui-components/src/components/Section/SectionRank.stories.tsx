import type { Meta, StoryObj } from '@storybook/react';
import SectionRank from './SectionRank';

/**
 * SectionRank displays a numeric value out of a maximum with an optional description.
 *
 * Use it to show scores, ratings, progress indicators, or any numeric ranking.
 */
const meta = {
  title: 'Components/Section/SectionRank',
  component: SectionRank,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'SectionRank component displays a numeric value out of a maximum (default 100) with an optional description. Perfect for showing scores, ratings, or progress indicators.',
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
      description: 'The maximum value (default: 100)',
      table: {
        defaultValue: { summary: '100' },
      },
    },
    description: {
      control: 'text',
      description: 'Optional description text below the value',
    },
  },
} satisfies Meta<typeof SectionRank>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic rank with default max value (100)
 */
export const Default: Story = {
  args: {
    value: 75,
    description: 'current score',
  },
};

/**
 * Rank with custom max value
 */
export const CustomMax: Story = {
  args: {
    value: 8,
    maxValue: 10,
    description: 'tasks completed',
  },
};

/**
 * Rank without description
 */
export const NoDescription: Story = {
  args: {
    value: 4,
    maxValue: 5,
  },
};

/**
 * Rank with zero value
 */
export const ZeroValue: Story = {
  args: {
    value: 0,
    maxValue: 100,
    description: 'starting value',
  },
};

/**
 * Rank with value exceeding max (clamped visually)
 */
export const OverMax: Story = {
  args: {
    value: 150,
    maxValue: 100,
    description: 'value exceeds maximum',
  },
};

/**
 * Rank with small values
 */
export const SmallValues: Story = {
  args: {
    value: 1,
    maxValue: 3,
    description: 'out of three options',
  },
};

/**
 * Rank with large values
 */
export const LargeValues: Story = {
  args: {
    value: 850,
    maxValue: 1000,
    description: 'points earned',
  },
};

/**
 * Perfect score example
 */
export const PerfectScore: Story = {
  args: {
    value: 100,
    maxValue: 100,
    description: 'perfect score!',
  },
};
