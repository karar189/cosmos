/** @jsxImportSource @emotion/react */
import type { Meta, StoryObj } from '@storybook/react';
import { BadgeCell } from './BadgeCell';

/**
 * BadgeCell displays a score with a grade badge.
 * Color is automatically determined based on score thresholds.
 * 
 * This component extends Badge.tsx for rendering the badge,
 * but provides a custom-sized loading skeleton optimized for table cells.
 */
const meta = {
  title: 'Components/DataTable/BadgeCell',
  component: BadgeCell,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Cell component for displaying a score with a grade badge. Color is automatically determined based on score thresholds. Extends Badge.tsx for rendering but provides a custom-sized loading skeleton.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BadgeCell>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Green variant (score < 40) - AAA grade
 */
export const Green: Story = {
  args: {
    value: { score: 35, grade: 'AAA' },
  },
};

/**
 * Yellow variant (40 ≤ score < 65) - B grade
 */
export const Yellow: Story = {
  args: {
    value: { score: 55, grade: 'B' },
  },
};

/**
 * Orange variant (65 ≤ score < 90) - C grade
 */
export const Orange: Story = {
  args: {
    value: { score: 72, grade: 'C' },
  },
};

/**
 * Red variant (score ≥ 90) - DDD grade
 */
export const Red: Story = {
  args: {
    value: { score: 95, grade: 'DDD' },
  },
};

/**
 * Edge case: Exactly 40 (Yellow - B)
 */
export const EdgeCase40: Story = {
  args: {
    value: { score: 40, grade: 'B' },
  },
};

/**
 * Edge case: Exactly 65 (Orange - C)
 */
export const EdgeCase65: Story = {
  args: {
    value: { score: 65, grade: 'C' },
  },
};

/**
 * Edge case: Exactly 90 (Red - DDD)
 */
export const EdgeCase90: Story = {
  args: {
    value: { score: 90, grade: 'DDD' },
  },
};

/**
 * Loading state - Shows custom-sized skeleton (80x24px)
 * Note: BadgeCell uses a custom loading skeleton instead of Badge's default.
 */
export const Loading: Story = {
  args: {
    value: { score: 35, grade: 'AAA' },
    loading: true,
  },
};

/**
 * All variants together
 */
export const AllVariants: Story = {
  args: {
    value: { score: 35, grade: 'AAA' },
    getColor: (score: number) => {
      if (score < 40) return 'green';
      if (score < 65) return 'yellow';
      if (score < 90) return 'orange';
      return 'red';
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
      <BadgeCell value={{ score: 35, grade: 'AAA' }} />
      <BadgeCell value={{ score: 55, grade: 'B' }} />
      <BadgeCell value={{ score: 72, grade: 'C' }} />
      <BadgeCell value={{ score: 95, grade: 'DDD' }} />
    </div>
  ),
};

