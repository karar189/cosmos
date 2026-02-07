import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent } from '@storybook/test';
import OptionCard from './OptionCard';
import { Icon } from '../Icon';
import React, { useState } from 'react';

const meta: Meta<typeof OptionCard> = {
  title: 'Components/OptionCard',
  component: OptionCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      description: 'Icon element to display on the left',
    },
    title: {
      description: 'Title text for the option',
      control: 'text',
    },
    description: {
      description: 'Description text below the title',
      control: 'text',
    },
    actionType: {
      description: 'Type of action button on the right',
      control: 'select',
      options: ['arrow', 'radio'],
    },
    selected: {
      description: 'Whether the option is selected (radio type only)',
      control: 'boolean',
    },
    disabled: {
      description: 'Whether the card is disabled',
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof OptionCard>;

/**
 * Basic card with arrow button for navigation
 */
export const WithArrow: Story = {
  args: {
    icon: <Icon name="bank" />,
    title: 'Organization',
    description: 'For crypto projects, exchanges and organizations',
    actionType: 'arrow',
  },
  /**
   * Interaction test:
   * - Renders title and description
   * - Shows arrow icon
   * - Has role="button"
   * - Is keyboard accessible
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check text content
    const title = canvas.getByText('Organization');
    const description = canvas.getByText('For crypto projects, exchanges and organizations');
    
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    
    // Check it's a button
    const card = canvas.getByRole('button');
    expect(card).toBeInTheDocument();
    expect(card).not.toHaveAttribute('aria-disabled', 'true');
    
    // Should have tabIndex 0 for keyboard accessibility
    expect(card).toHaveAttribute('tabIndex', '0');
  },
};

/**
 * Card with radio button unselected
 */
export const WithRadio: Story = {
  args: {
    icon: <Icon name="bank" />,
    title: 'Organization',
    description: 'For crypto projects, exchanges and organizations',
    actionType: 'radio',
    selected: false,
  },
  /**
   * Interaction test:
   * - Renders with radio button
   * - Not selected initially
   * - Has proper aria attributes
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Organization')).toBeInTheDocument();
    
    const card = canvas.getByRole('button');
    expect(card).toBeInTheDocument();
    
    // Check aria-pressed for radio type
    expect(card).toHaveAttribute('aria-pressed', 'false');
    
    // Check radio input exists
    const radio = canvasElement.querySelector('input[type="radio"]');
    expect(radio).toBeInTheDocument();
    expect(radio).not.toBeChecked();
  },
};

/**
 * Card with radio button selected
 */
export const WithRadioSelected: Story = {
  args: {
    icon: <Icon name="bank" />,
    title: 'Organization',
    description: 'For crypto projects, exchanges and organizations',
    actionType: 'radio',
    selected: true,
  },
  /**
   * Interaction test:
   * - Renders with selected radio button
   * - Has aria-pressed="true"
   * - Radio input is checked
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Organization')).toBeInTheDocument();
    
    const card = canvas.getByRole('button');
    expect(card).toHaveAttribute('aria-pressed', 'true');
    
    // Check radio is checked
    const radio = canvasElement.querySelector('input[type="radio"]');
    expect(radio).toBeInTheDocument();
    expect(radio).toBeChecked();
  },
};