import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from '@storybook/test';
import React from 'react';
import TooltipIcon from './TooltipIcon';
import Tooltip from './Tooltip';

const meta = {
  title: 'Components/Tooltip/TooltipIcon',
  component: TooltipIcon,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'TooltipIcon component wraps an icon with MUI Tooltip functionality. It provides consistent styling and behavior for tooltip icons throughout the application. Hover over the icon to see the tooltip.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: false,
      description: 'Optional icon element. Defaults to info icon.',
    },
  },
} satisfies Meta<typeof TooltipIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  },
};

export const CustomIcon: Story = {
  args: {
    icon: 'warning-triangle',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  },
};

export const WithTooltip: Story = {
  render: () => (
    <Tooltip title="This is a helpful tooltip message">
      <TooltipIcon icon="info" />
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
        
    await waitFor(
      () => {
        const tooltip = document.querySelector('[role="tooltip"]');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toBeVisible();
        expect(tooltip).toHaveTextContent('This is a helpful tooltip message');
      },
      { timeout: 1000 }
    );
    
    
    await waitFor(
      () => {
        const tooltip = document.querySelector('[role="tooltip"]');
      },
      { timeout: 1000 }
    );
  },
};

export const WithTooltipTitle: Story = {
  render: () => (
    <Tooltip title="This is the tooltip content" tooltipTitle="Important Information">
      <TooltipIcon icon="warning-triangle" />
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    
    await waitFor(
      () => {
        const tooltip = document.querySelector('[role="tooltip"]');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toBeVisible();
        expect(tooltip).toHaveTextContent('Important Information');
        expect(tooltip).toHaveTextContent('This is the tooltip content');
      },
      { timeout: 1000 }
    );
  },
};