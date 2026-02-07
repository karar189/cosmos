import { expect, within, userEvent } from '@storybook/test';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Badge } from '../Badge';
import ExpandableBadgeList from './ExpandableBadgeList';

const meta = {
  title: 'Components/ExpandableBadgeList',
  component: ExpandableBadgeList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ExpandableBadgeList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default with 2 visible badges
 */
export const Default: Story = {
  args: {
    items: [
      <Badge size="small" key="1" color="gray">Tag 1</Badge>,
      <Badge size="small" key="2" color="gray">Tag 2</Badge>,
      <Badge size="small" key="3" color="gray">Tag 3</Badge>,
      <Badge size="small" key="4" color="gray">Tag 4</Badge>,
      <Badge size="small" key="5" color="gray">Tag 5</Badge>,
    ],
    maxVisible: 2,
  },
  /**
   * Interaction test:
   * - Renders only `maxVisible` badges initially
   * - Shows expand badge with remaining count
   * - Expands to show all badges on click
   */
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('Tag 1')).toBeInTheDocument();
    expect(canvas.getByText('Tag 2')).toBeInTheDocument();
    expect(canvas.queryByText('Tag 3')).not.toBeInTheDocument();

    const expandBadge = canvas.getByText('+3');
    expect(expandBadge).toBeVisible();

    await userEvent.click(expandBadge);

    expect(canvas.getByText('Tag 3')).toBeInTheDocument();
    expect(canvas.getByText('Tag 4')).toBeInTheDocument();
    expect(canvas.getByText('Tag 5')).toBeInTheDocument();
  },
};

/**
 * Show 3 visible badges initially
 */
export const ThreeVisible: Story = {
  args: {
    items: [
      <Badge size="small" key="1" color="gray">Frontend</Badge>,
      <Badge size="small" key="2" color="gray">Backend</Badge>,
      <Badge size="small" key="3" color="gray">DevOps</Badge>,
      <Badge size="small" key="4" color="gray">Design</Badge>,
      <Badge size="small" key="5" color="gray">QA</Badge>,
      <Badge size="small" key="6" color="gray">Security</Badge>,
      <Badge size="small" key="7" color="gray">Analytics</Badge>,
    ],
    maxVisible: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('Frontend')).toBeInTheDocument();
    expect(canvas.getByText('Backend')).toBeInTheDocument();
    expect(canvas.getByText('DevOps')).toBeInTheDocument();

    expect(canvas.queryByText('Design')).not.toBeInTheDocument();

    const expandBadge = canvas.getByText('+4');
    expect(expandBadge).toBeVisible();

    await userEvent.click(expandBadge);

    expect(canvas.getByText('Analytics')).toBeInTheDocument();
  },
};

/**
 * Show 4 visible badges initially
 */
export const FourVisible: Story = {
  args: {
    items: [
      <Badge size="small" key="1" color="gray">JavaScript</Badge>,
      <Badge size="small" key="2" color="gray">TypeScript</Badge>,
      <Badge size="small" key="3" color="gray">React</Badge>,
      <Badge size="small" key="4" color="gray">Node.js</Badge>,
      <Badge size="small" key="5" color="gray">GraphQL</Badge>,
    ],
    maxVisible: 4,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('Node.js')).toBeInTheDocument();
    expect(canvas.queryByText('GraphQL')).not.toBeInTheDocument();

    const expandBadge = canvas.getByText('+1');
    await userEvent.click(expandBadge);

    expect(canvas.getByText('GraphQL')).toBeInTheDocument();
  },
};

/**
 * Large number of items
 */
export const ManyItems: Story = {
  args: {
    items: Array.from({ length: 15 }, (_, i) => (
      <Badge size="small" key={i} color="gray">{`Item ${i + 1}`}</Badge>
    )),
    maxVisible: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('Item 1')).toBeInTheDocument();
    expect(canvas.getByText('Item 3')).toBeInTheDocument();
    expect(canvas.queryByText('Item 4')).not.toBeInTheDocument();

    const expandBadge = canvas.getByText('+12');
    expect(expandBadge).toBeVisible();

    await userEvent.click(expandBadge);

    expect(canvas.getByText('Item 15')).toBeInTheDocument();
  },
};

/**
 * Color variants
 */
export const ColorsVariant: Story = {
  args: {
    items: [
      <Badge size="small" key="1" color="orange">Orange</Badge>,
      <Badge size="small" key="2" color="red">Red</Badge>,
      <Badge size="small" key="3" color="green">Green</Badge>,
      <Badge size="small" key="4" color="yellow">Yellow</Badge>,
      <Badge size="small" key="5" color="gray">Gray</Badge>,
      <Badge size="small" key="6" color="default">Default</Badge>,
    ],
    maxVisible: 2,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByText('Orange')).toBeInTheDocument();
    expect(canvas.getByText('Red')).toBeInTheDocument();

    const expandBadge = canvas.getByText('+4');
    await userEvent.click(expandBadge);

    expect(canvas.getByText('Default')).toBeInTheDocument();
  },
};
