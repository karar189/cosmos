import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import Stepper from './Stepper';

/**
 * A vertical step component used to display a list of steps in a vertical order.
 */
const meta = {
  title: 'Components/Step',
  component: Stepper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A vertical step component used to display a list of steps in a vertical order.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    steps: {
      control: 'object',
      description: 'Array of steps to render',
    },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Project step
 */
export const Default: Story = {
  args: {
    steps: [
      { title: 'Create a Group in Telegram' },
      { title: 'Add anyone necessary for the communication' },
      { title: 'Copy and paste link to this group below' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Verify all step titles are rendered
    expect(canvas.getByText('Create a Group in Telegram')).toBeInTheDocument();
    expect(canvas.getByText('Add anyone necessary for the communication')).toBeInTheDocument();
    expect(canvas.getByText('Copy and paste link to this group below')).toBeInTheDocument();
    
    // Verify all step numbers are rendered (1, 2, 3)
    expect(canvas.getByText('1')).toBeInTheDocument();
    expect(canvas.getByText('2')).toBeInTheDocument();
    expect(canvas.getByText('3')).toBeInTheDocument();
    
    // Verify all 3 steps are rendered by counting step titles
    const stepTitles = [
      canvas.getByText('Create a Group in Telegram'),
      canvas.getByText('Add anyone necessary for the communication'),
      canvas.getByText('Copy and paste link to this group below'),
    ];
    expect(stepTitles).toHaveLength(3);
  },
};
