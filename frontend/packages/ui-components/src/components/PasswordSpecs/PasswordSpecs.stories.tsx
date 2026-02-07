import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import PasswordSpecs from './PasswordSpecs';

/**
 * PasswordSpecs displays password requirements with visual feedback.
 * All text must be provided via props - no hardcoded text.
 */
const meta = {
  title: 'Components/PasswordSpecs',
  component: PasswordSpecs,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A reusable password specs component that shows password requirements with visual feedback based on password strength.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    password: {
      control: 'text',
      description: 'Current password value to validate',
    },
    labels: {
      control: 'object',
      description: 'Labels for each password requirement',
    },
    minLength: {
      control: 'number',
      description: 'Minimum password length',
    },
  },
} satisfies Meta<typeof PasswordSpecs>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default PasswordSpecs with empty password
 */
export const Default: Story = {
  args: {
    password: '',
    labels: {
      minLength: '8 characters minimum',
      number: 'at least 1 number',
      symbol: 'at least 1 symbol',
    },
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('8 characters minimum')).toBeInTheDocument();
    expect(canvas.getByText('at least 1 number')).toBeInTheDocument();
    expect(canvas.getByText('at least 1 symbol')).toBeInTheDocument();

    const listItems = canvasElement.querySelectorAll('li');
    expect(listItems).toHaveLength(3);
  },
};

/**
 * PasswordSpecs with a weak password (only meets length requirement)
 */
export const WeakPassword: Story = {
  args: {
    password: 'password',
    labels: {
      minLength: '8 characters minimum',
      number: 'at least 1 number',
      symbol: 'at least 1 symbol',
    },
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('8 characters minimum')).toBeInTheDocument();
    expect(canvas.getByText('at least 1 number')).toBeInTheDocument();
    expect(canvas.getByText('at least 1 symbol')).toBeInTheDocument();
    
    const listItems = canvasElement.querySelectorAll('li');
    expect(listItems).toHaveLength(3);
  },
};

/**
 * PasswordSpecs with a strong password (meets all requirements)
 */
export const StrongPassword: Story = {
  args: {
    password: 'Password123!',
    labels: {
      minLength: '8 characters minimum',
      number: 'at least 1 number',
      symbol: 'at least 1 symbol',
    },
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('8 characters minimum')).toBeInTheDocument();
    expect(canvas.getByText('at least 1 number')).toBeInTheDocument();
    expect(canvas.getByText('at least 1 symbol')).toBeInTheDocument();
    
    const listItems = canvasElement.querySelectorAll('li');
    expect(listItems).toHaveLength(3);
  },
};