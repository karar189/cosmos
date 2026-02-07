import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import Tag from './Tag';
import { colors } from '../../theme/styleSystem';

const meta = {
  title: 'Components/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible pill-shaped label component for displaying categories with customizable background colors. Features a consistent border and text color.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: 'text',
      description: 'Text content of the tag',
    },
    backgroundColor: {
      control: 'color',
      description:
        'Background color of the tag (defaults to transparent to inherit parent background)',
      table: {
        defaultValue: { summary: 'transparent' },
      },
    },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Project: Story = {
  args: {
    text: 'Project',
    backgroundColor: colors.background.paper,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const tag = canvas.getByText('Project');
    expect(tag).toBeInTheDocument();
    expect(tag).toBeVisible();
    
    const tagElement = tag.closest('div') || tag;
    const styles = window.getComputedStyle(tagElement);
    expect(styles.backgroundColor).toBe('rgb(255, 253, 234)');
  },
};

export const Organization: Story = {
  args: {
    text: 'Organization',
    backgroundColor: colors.background.paper,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const tag = canvas.getByText('Organization');
    expect(tag).toBeInTheDocument();
    expect(tag).toBeVisible();
    
    const tagElement = tag.closest('div') || tag;
    const styles = window.getComputedStyle(tagElement);
    expect(styles.backgroundColor).toBe('rgb(255, 253, 234)');
  },
};