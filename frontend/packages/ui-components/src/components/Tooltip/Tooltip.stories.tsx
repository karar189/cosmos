import Tooltip from './Tooltip';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from '@storybook/test';
import React from 'react';
import { IconName } from '../Icon';
import TooltipIcon from './TooltipIcon';

interface TooltipDemoProps {
  title: string;
  tooltipTitle?: string;
  icon?: IconName;
}

function TooltipDemo({ title, tooltipTitle, icon }: TooltipDemoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
      <Tooltip title={title} tooltipTitle={tooltipTitle}>
        <div>
          <TooltipIcon icon={icon} />
        </div>
      </Tooltip>
      <span>Hover over the icon to see the tooltip</span>
    </div>
  );
}

const meta = {
  title: 'Components/Tooltip',
  component: TooltipDemo,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'MUI Tooltip provides contextual information when users hover over elements. Use it with TooltipIcon for consistent styling across the application.',
      },
    },
  },
  argTypes: {
    icon: {
      control: false,
      description: 'Optional icon element. Defaults to info icon.',
    },
    title: {
      control: 'text',
      description: 'Tooltip content text',
    },
    tooltipTitle: {
      control: 'text',
      description: 'Optional title/heading displayed above the tooltip content',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TooltipDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BasicTooltip: Story = {
  args: {
    icon: 'info',
    title: 'This is a basic tooltip message',
  },
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    if (!svg) throw new Error('SVG not found');
    
    await userEvent.hover(svg);
    
    await waitFor(
      () => {
        const tooltip = document.querySelector('[role="tooltip"]');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toBeVisible();
        expect(tooltip).toHaveTextContent('This is a basic tooltip message');
      },
      { timeout: 1000 }
    );
    
    await userEvent.unhover(svg);
    
   
  },
};

export const TooltipWithTitle: Story = {
  args: {
    icon: 'info',
    tooltipTitle: 'Data Example',
    title: 'Provided data before XX.XX.XXXX is an example',
  },
  play: async ({ canvasElement }) => {
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toBeVisible();
    
    if (!svg) throw new Error('SVG not found');
    
    await userEvent.hover(svg);
    
    await waitFor(
      () => {
        const tooltip = document.querySelector('[role="tooltip"]');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toBeVisible();
        expect(tooltip).toHaveTextContent('Data Example');
        expect(tooltip).toHaveTextContent('Provided data before XX.XX.XXXX is an example');
      },
      { timeout: 1000 }
    );
    
    await userEvent.unhover(svg);
    
    await waitFor(
      () => {
        const tooltip = document.querySelector('[role="tooltip"]');
        expect(tooltip).toBeNull();
      },
      { timeout: 1000 }
    );
  },
};