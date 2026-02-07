import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from '@storybook/test';
import React, { useState } from 'react';
import Select, { SelectOption } from './Select';

/**
 * Wrapper component for Select stories with state management
 */
interface SelectDemoProps {
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  initialValue?: string | number;
}

function SelectDemo({ options, placeholder, disabled, initialValue = '' }: SelectDemoProps) {
  const [value, setValue] = useState<string | number>(initialValue);

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <Select
        options={options}
        value={value}
        onChange={setValue}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}

/**
 * Select component provides a dropdown menu for selecting a single option from a list.
 */
const meta = {
  title: 'Components/Select',
  component: SelectDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A single-select dropdown component with custom styling. Use it when users need to choose one option from a list.',
      },
    },
  },
  argTypes: {
    options: {
      control: 'object',
      description: 'Array of options to display in the dropdown',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no selection is made',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
    initialValue: {
      control: 'text',
      description: 'Initial selected value',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SelectDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default select with placeholder
 */
export const Default: Story = {
  args: {
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    placeholder: 'Select an option...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Select an option...')).toBeInTheDocument();
    
    const select = canvas.getByRole('combobox');
    expect(select).toBeInTheDocument();
    
    await userEvent.click(select);
    
    const body = within(document.body);
    await waitFor(() => {
      const option1 = body.queryByText('Option 1');
      const option2 = body.queryByText('Option 2');
      const option3 = body.queryByText('Option 3');
      expect(option1).toBeInTheDocument();
      expect(option2).toBeInTheDocument();
      expect(option3).toBeInTheDocument();
    });
    
    await userEvent.click(body.getByText('Option 2'));
    
    await waitFor(() => {
      expect(canvas.getByText('Option 2')).toBeInTheDocument();
    });
  },
};

/**
 * Select with pre-selected value
 */
export const WithValue: Story = {
  args: {
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
    initialValue: 'option2',
    placeholder: 'Select an option...',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Option 2')).toBeInTheDocument();
    expect(canvas.queryByText('Select an option...')).not.toBeInTheDocument();
    
    const select = canvas.getByRole('combobox');
    expect(select).toBeInTheDocument();
    
    await userEvent.click(select);
  },
};

/**
 * Disabled select
 */
export const Disabled: Story = {
  args: {
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ],
    placeholder: 'Select an option...',
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Select an option...')).toBeInTheDocument();
    
    const select = canvas.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute('aria-disabled', 'true');
    
    expect(canvas.queryByText('Option 1')).not.toBeInTheDocument();
    expect(canvas.queryByText('Option 2')).not.toBeInTheDocument();
    
    await userEvent.click(select);
    
    await waitFor(() => {
      expect(canvas.queryByText('Option 1')).not.toBeInTheDocument();
    });
    expect(canvas.queryByText('Option 2')).not.toBeInTheDocument();
  },
};

