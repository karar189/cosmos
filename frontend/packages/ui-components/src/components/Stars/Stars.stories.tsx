import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/test';
import Stars from './Stars';

/**
 * Stars is a rating component that displays filled and unfilled stars.
 * Uses the Icon component to render star icons with configurable colors.
 */
const meta = {
  title: 'Components/Stars',
  component: Stars,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A rating component that displays a configurable number of stars with filled and unfilled states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 5, step: 1 },
      description: 'Number of filled stars',
    },
    max: {
      control: { type: 'number', min: 1, max: 10, step: 1 },
      description: 'Maximum number of stars to display',
      table: {
        defaultValue: { summary: '3' },
      },
    },
  },
} satisfies Meta<typeof Stars>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default stars with 3 stars total, 2 filled
 */
export const Default: Story = {
  args: {
    value: 2,
    max: 3,
  },
  play: async ({ canvasElement }) => {
    // Verify the stars container exists
    const container = canvasElement.querySelector('.stars-container');
    expect(container).toBeInTheDocument();
    
    // Verify exactly 3 stars are rendered (SVG elements)
    const stars = canvasElement.querySelectorAll('svg');
    expect(stars).toHaveLength(3);
  },
};

/**
 * One star filled
 */
export const OneStar: Story = {
  args: {
    value: 1,
    max: 3,
  },
  play: async ({ canvasElement }) => {
    // Verify the stars container exists
    const container = canvasElement.querySelector('.stars-container');
    expect(container).toBeInTheDocument();
    
    // Verify exactly 3 stars are rendered
    const stars = canvasElement.querySelectorAll('svg');
    expect(stars).toHaveLength(3);
  },
};

/**
 * All stars filled
 */
export const AllFilled: Story = {
  args: {
    value: 3,
    max: 3,
  },
  play: async ({ canvasElement }) => {
    // Verify the stars container exists
    const container = canvasElement.querySelector('.stars-container');
    expect(container).toBeInTheDocument();
    
    // Verify exactly 3 stars are rendered
    const stars = canvasElement.querySelectorAll('svg');
    expect(stars).toHaveLength(3);
  },
};

/**
 * No stars filled
 */
export const Empty: Story = {
  args: {
    value: 0,
    max: 3,
  },
  play: async ({ canvasElement }) => {
    // Verify the stars container exists
    const container = canvasElement.querySelector('.stars-container');
    expect(container).toBeInTheDocument();
    
    // Verify exactly 3 stars are rendered (even when value is 0, all stars are shown but unfilled)
    const stars = canvasElement.querySelectorAll('svg');
    expect(stars).toHaveLength(3);
  },
};
