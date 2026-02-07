/** @jsxImportSource @emotion/react */
import type { Meta, StoryObj } from '@storybook/react';
import { ProgressCell } from './ProgressCell';

/**
 * ProgressCell displays a progress bar with percentage text.
 * Color is automatically determined based on value thresholds.
 */
const meta = {
  title: 'Components/DataTable/ProgressCell',
  component: ProgressCell,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Cell component for displaying a progress bar with automatically colored fill based on percentage thresholds.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '300px', padding: '1rem', border: '1px solid #e0e0e0' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressCell>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * High coverage (≥ 90%) - Green
 */
export const HighCoverage: Story = {
  args: {
    value: '95%',
  },
};

/**
 * Good coverage (50-89%) - Accent Orange
 */
export const GoodCoverage: Story = {
  args: {
    value: '75%',
  },
};

/**
 * Medium coverage (30-49%) - Orange
 */
export const MediumCoverage: Story = {
  args: {
    value: '40%',
  },
};

/**
 * Low coverage (< 30%) - Red
 */
export const LowCoverage: Story = {
  args: {
    value: '25%',
  },
};

/**
 * With numeric value (no %)
 */
export const NumericValue: Story = {
  args: {
    value: 85,
  },
};

/**
 * Full progress (100%)
 */
export const FullProgress: Story = {
  args: {
    value: '100%',
  },
};

/**
 * Minimal progress
 */
export const MinimalProgress: Story = {
  args: {
    value: '5%',
  },
};

/**
 * All variants together
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', width: '300px' }}>
      <ProgressCell value="95%" />
      <ProgressCell value="75%" />
      <ProgressCell value="40%" />
      <ProgressCell value="25%" />
    </div>
  ),
};

