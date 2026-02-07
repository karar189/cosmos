/** @jsxImportSource @emotion/react */
import type { Meta, StoryObj } from '@storybook/react';
import { NumberCell } from './NumberCell';

/**
 * NumberCell displays numeric data with various formatting options.
 * Supports both single value and dual value (primary + secondary) modes.
 */
const meta = {
  title: 'Components/DataTable/NumberCell',
  component: NumberCell,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Reusable cell component for displaying numeric data in tables with flexible formatting and optional dual values.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ minWidth: '200px', padding: '1rem', border: '1px solid #e0e0e0' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NumberCell>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Simple number display
 */
export const SimpleNumber: Story = {
  args: {
    value: 123456,
    format: 'number',
  },
};

/**
 * Money format with currency symbol
 */
export const MoneyFormat: Story = {
  args: {
    value: 1234567.89,
    format: 'money',
  },
};

/**
 * Compact notation for large numbers
 */
export const CompactFormat: Story = {
  args: {
    value: 1234567890,
    format: 'compact',
  },
};

/**
 * String value (already formatted)
 */
export const StringValue: Story = {
  args: {
    value: '$1.2M',
  },
};

/**
 * Percentage with positive value
 */
export const PositivePercentage: Story = {
  args: {
    value: '+12.5%',
  },
};

/**
 * Negative change
 */
export const NegativeChange: Story = {
  args: {
    value: '-8.3%',
  },
};

/**
 * Dual values - percentage and money (like market cap change)
 */
export const DualValuesChange: Story = {
  args: {
    primary: '+12.5%',
    secondary: '$1.2M',
    primaryFormat: 'percentage',
    secondaryFormat: 'money',
  },
};

/**
 * Dual values - negative change
 */
export const DualValuesNegative: Story = {
  args: {
    primary: '-8.3%',
    secondary: '$-450K',
    primaryFormat: 'percentage',
    secondaryFormat: 'money',
  },
};

/**
 * Dual values - custom formatted strings
 */
export const DualValuesCustom: Story = {
  args: {
    primary: '+12.5%',
    secondary: '($1.2M)',
  },
};

/**
 * Left aligned
 */
export const LeftAligned: Story = {
  args: {
    value: '$1,234,567',
    align: 'left',
  },
};

/**
 * Center aligned
 */
export const CenterAligned: Story = {
  args: {
    value: '$1,234,567',
    align: 'center',
  },
};

/**
 * Right aligned (default)
 */
export const RightAligned: Story = {
  args: {
    value: '$1,234,567',
    align: 'right',
  },
};

/**
 * Complex example: Market Cap Change
 */
export const MarketCapChange: Story = {
  args: {
    primary: '+15.7%',
    secondary: '$2.3M',
    primaryFormat: 'percentage',
    secondaryFormat: 'money',
    align: 'right',
  },
};

/**
 * Primary value only (no secondary)
 */
export const PrimaryOnly: Story = {
  args: {
    primary: '+12.5%',
  },
};

