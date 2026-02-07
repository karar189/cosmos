import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from '@storybook/test';
import React, { useState } from 'react';
import MultiSelect, { MultiSelectOption } from './MultiSelect';

/**
 * Wrapper component for MultiSelect stories with state management
 */
interface MultiSelectDemoProps {
  options: MultiSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  initialValue?: string[];
}

function MultiSelectDemo({ options, placeholder, disabled, initialValue = [] }: MultiSelectDemoProps) {
  const [value, setValue] = useState<string[]>(initialValue);

  return (
    <div style={{ padding: '20px', maxWidth: '400px' }}>
      <MultiSelect
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
 * MultiSelect component provides a dropdown menu for selecting multiple options from a list.
 */
const meta = {
  title: 'Components/MultiSelect',
  component: MultiSelectDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A multi-select dropdown component with custom styling and checkboxes. Use it when users need to choose multiple options from a list.',
      },
    },
  },
  argTypes: {
    options: {
      control: 'object',
      description: 'Array of options to display in the dropdown. Each option can have an optional count property.',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown in the dropdown',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select is disabled',
    },
    initialValue: {
      control: 'object',
      description: 'Initial selected values (array of strings)',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MultiSelectDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default multi-select with placeholder
 */
export const Default: Story = {
  args: {
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
      { value: 'option4', label: 'Option 4' },
    ],
    placeholder: 'Select options...',
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const placeholder = canvas.getByText('Select options...');
    expect(placeholder).toBeInTheDocument();

    const selectButton = canvas.getByRole('combobox');
    await userEvent.click(selectButton);

    await waitFor(() => {
      const option1 = within(document.body).getByText('Option 1');
      expect(option1).toBeInTheDocument();
    });

    const option1 = within(document.body).getByText('Option 1');
    const option2 = within(document.body).getByText('Option 2');

    await userEvent.click(option1);

    await waitFor(() => {
      const badge = canvas.getByText('1');
      expect(badge).toBeInTheDocument();
    });

    await userEvent.click(option2);

    await waitFor(() => {
      const badge = canvas.getByText('2');
      expect(badge).toBeInTheDocument();
    });
  },
};

/**
 * Multi-select with pre-selected values
 */
export const WithValues: Story = {
  args: {
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
      { value: 'option4', label: 'Option 4' },
    ],
    initialValue: ['option1', 'option3'],
    placeholder: 'Select options...',
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const badge = canvas.getByText('2');
    expect(badge).toBeInTheDocument();

    const selectButton = canvas.getByRole('combobox');
    await userEvent.click(selectButton);

    await waitFor(() => {
      const option1 = within(document.body).getByText('Option 1');
      expect(option1).toBeInTheDocument();
    });

    const checkboxes = document.body.querySelectorAll('input[type="checkbox"]');
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).toBeChecked();
    expect(checkboxes[3]).not.toBeChecked(); 

    const option1 = within(document.body).getByText('Option 1');
    await userEvent.click(option1);

    await waitFor(() => {
      const updatedBadge = canvas.getByText('1');
      expect(updatedBadge).toBeInTheDocument();
    });
  },
};

/**
 * Multi-select with count property for each option
 */
export const WithCounts: Story = {
  args: {
    options: [
      { value: 'option1', label: 'Option 1', count: 15 },
      { value: 'option2', label: 'Option 2', count: 8 },
      { value: 'option3', label: 'Option 3', count: 12 },
      { value: 'option4', label: 'Option 4', count: 5 },
    ],
    placeholder: 'Select options...',
  },

  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const selectButton = canvas.getByRole('combobox');
    await userEvent.click(selectButton);

    await waitFor(() => {
      expect(within(document.body).getByText('15')).toBeInTheDocument();
      expect(within(document.body).getByText('8')).toBeInTheDocument();
      expect(within(document.body).getByText('12')).toBeInTheDocument();
      expect(within(document.body).getByText('5')).toBeInTheDocument();
    });
    
    expect(within(document.body).getByText('Option 1')).toBeInTheDocument();
    expect(within(document.body).getByText('Option 2')).toBeInTheDocument();

    const option1 = within(document.body).getByText('Option 1');
    await userEvent.click(option1);
    
    await waitFor(() => {
      const badges = canvas.getAllByText('1');
      expect(badges.length).toBeGreaterThanOrEqual(1);
    });
  },
};

/**
 * Disabled multi-select
 */
export const Disabled: Story = {
  args: {
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ],
    placeholder: 'Select options...',
    disabled: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const placeholder = canvas.getByText('Select options...');
    expect(placeholder).toBeInTheDocument();

    const selectButton = canvasElement.querySelector('[aria-haspopup="listbox"]');
    expect(selectButton).toBeInTheDocument();

    if (selectButton) {
      expect(selectButton.hasAttribute('disabled') || selectButton.getAttribute('aria-disabled') === 'true').toBe(true);
    }
  },
};