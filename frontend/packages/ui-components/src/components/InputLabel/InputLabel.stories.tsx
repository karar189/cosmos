import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from '@storybook/test';
import Input from './InputLabel';

/**
 * FormBox is a standardized container component used throughout the project for form layouts.
 */
const meta = {
  title: 'Components/InputLabel',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A reusable input component with a label and an input field.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label to be rendered above the input field',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default InputLabel with a label and an input field
 */
export const Default: Story = {
  args: {
    label: 'corporate email',
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const label = canvas.getByText('CORPORATE EMAIL');
    expect(label).toBeInTheDocument();
    
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('');
    
    await userEvent.type(input, 'test@company.com');
    expect(input.value).toBe('test@company.com');
    
    const error = canvasElement.querySelector('p');
    expect(error).not.toBeInTheDocument();
  },
};

/**
 * InputLabel with error message
 */
export const WithError: Story = {
  args: {
    label: 'corporate email',
    error: 'Please enter a valid corporate email',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const error = canvas.getByText('Please enter a valid corporate email');
    expect(error).toBeInTheDocument();
    
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    await userEvent.type(input, 'invalid-email');
    expect(input.value).toBe('invalid-email');
    
    expect(error).toBeInTheDocument();
  },
};

/**
 * InputLabel with placeholder text
 */
export const WithPlaceholder: Story = {
  args: {
    label: 'corporate email',
    placeholder: 'Enter your corporate email',
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const input = canvas.getByPlaceholderText('Enter your corporate email') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Enter your corporate email');
    expect(input.value).toBe('');
    
    await userEvent.type(input, 'user@example.com');
    expect(input.value).toBe('user@example.com');
  },
};

/**
 * Password input with toggle visibility
 */
export const WithPassword: Story = {
  args: {
    label: 'Password',
    type: 'password',
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const input = canvasElement.querySelector('input') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.type).toBe('password');
    
    await userEvent.type(input, 'SecurePass123');
    expect(input.value).toBe('SecurePass123');
    
    const toggleButton = canvas.getByRole('button', { name: /show password/i });
    expect(toggleButton).toBeInTheDocument();
    
    await userEvent.click(toggleButton);
    expect(input.type).toBe('text');
    
    const hideButton = canvas.getByRole('button', { name: /hide password/i });
    expect(hideButton).toBeInTheDocument();
    
    await userEvent.click(hideButton);
    expect(input.type).toBe('password');
  },
};
