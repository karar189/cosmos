import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import React from 'react';
import Card from './Card';
import CardContainer from './CardContainer';
import { colors } from '../../theme/styleSystem';

/**
 * Card provides a container for organizing content into distinct card sections.
 *
 * Use it to wrap related content and create visual separation between different parts of your page.
 */
const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Card component provides a container for organizing content into distinct card sections. It combines CardHeader and CardContainer for a complete card structure.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: false,
      description: 'Card content',
    },
    id: {
      control: 'text',
      description: 'Optional HTML id attribute',
    },
    title: {
      control: 'text',
      description: 'Card title (required if showHeader is true)',
    },
    showHeader: {
      control: 'boolean',
      description: 'Whether to show the header',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic card with header
 */
export const Default: Story = {
  args: {
    title: 'Card Title',
    children: (
      <div>
        <p>This is the card content area. You can put anything here.</p>
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const title = canvas.getByRole('heading', { name: 'Card Title' });
    expect(title).toBeInTheDocument();
    
    expect(canvas.getByText('This is the card content area. You can put anything here.')).toBeInTheDocument();
  },
};

/**
 * Card with header and icon
 */
export const WithIcon: Story = {
  args: {
    icon: 'info',
    title: 'Information Card',
    children: (
      <div>
        <p>This card has an icon in the header.</p>
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const title = canvas.getByRole('heading', { name: 'Information Card' });
    expect(title).toBeInTheDocument();
    
    expect(canvas.getByText('This card has an icon in the header.')).toBeInTheDocument();
    
    // Check that icon is present (Icon component renders an SVG)
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
  },
};

/**
 * Card with header, icon, and tooltip
 */
export const WithTooltip: Story = {
  args: {
    icon: 'check-stamp',
    title: 'Compliance',
    tooltip: 'This card shows compliance information and metrics for your organization.',
    children: (
      <div>
        <p>Hover over the info icon to see the tooltip.</p>
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const title = canvas.getByRole('heading', { name: 'Compliance' });
    expect(title).toBeInTheDocument();
    
    expect(canvas.getByText('Hover over the info icon to see the tooltip.')).toBeInTheDocument();
    
    // Check that icon is present
    const svg = canvasElement.querySelector('svg');
    expect(svg).toBeInTheDocument();
  },
};

/**
 * Card without header (no title provided)
 */
export const WithoutHeader: Story = {
  args: {
    children: (
      <div>
        <p>This card has no header because no title was provided.</p>
        <p>The header is automatically hidden when there&apos;s no title.</p>
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Verify no heading is present
    const headings = canvas.queryAllByRole('heading');
    expect(headings).toHaveLength(0);
    
    expect(canvas.getByText('This card has no header because no title was provided.')).toBeInTheDocument();
    expect(canvas.getByText(/The header is automatically hidden when there's no title/)).toBeInTheDocument();
  },
};

/**
 * Card with header explicitly disabled
 */
export const HeaderDisabled: Story = {
  args: {
    title: 'Card Title',
    showHeader: false,
    children: (
      <div>
        <p>This card has a title but the header is explicitly disabled via showHeader prop.</p>
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Verify no heading is present even though title is provided
    const headings = canvas.queryAllByRole('heading');
    expect(headings).toHaveLength(0);
    
    expect(canvas.getByText('This card has a title but the header is explicitly disabled via showHeader prop.')).toBeInTheDocument();
  },
};

/**
 * Card with custom content
 */
export const CustomContent: Story = {
  args: {
    title: 'Custom Card',
    children: (
      <div>
        <p>This card contains custom content.</p>
        <p>You can put anything here - text, images, forms, etc.</p>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
          <li>List item 3</li>
        </ul>
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const title = canvas.getByRole('heading', { name: 'Custom Card' });
    expect(title).toBeInTheDocument();
    
    expect(canvas.getByText('This card contains custom content.')).toBeInTheDocument();
    expect(canvas.getByText('You can put anything here - text, images, forms, etc.')).toBeInTheDocument();
    
    // Check list items
    expect(canvas.getByText('List item 1')).toBeInTheDocument();
    expect(canvas.getByText('List item 2')).toBeInTheDocument();
    expect(canvas.getByText('List item 3')).toBeInTheDocument();
  },
};

/**
 * CardContainer with large padding (24px)
 * Useful for forms and detailed content
 */
export const LargePadding = {
  render: () => (
    <CardContainer paddingSize="l">
      <h2 style={{ margin: 0, fontSize: '24px', fontFamily: 'Aeonik', fontWeight: 500 }}>
        Submit Data
      </h2>
      <p style={{ margin: 0, fontSize: '16px', color: colors.text.secondary }}>
        This card uses the large padding variant (24px instead of default 16px).
      </p>
      <p style={{ margin: 0, fontSize: '16px', color: colors.text.secondary }}>
        Ideal for forms, detailed content, or when you need more breathing room.
      </p>
    </CardContainer>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const heading = canvas.getByRole('heading', { name: 'Submit Data' });
    expect(heading).toBeInTheDocument();
    
    expect(canvas.getByText(/This card uses the large padding variant/)).toBeInTheDocument();
    expect(canvas.getByText(/Ideal for forms, detailed content/)).toBeInTheDocument();
  },
};
