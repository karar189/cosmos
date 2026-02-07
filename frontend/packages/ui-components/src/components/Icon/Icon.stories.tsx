import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import Icon from './Icon';
import { IconButton } from '@mui/material';
import { colors } from '../../theme/styleSystem';

/**
 * Icon provides a unified icon component compatible with MUI's Icon API.
 *
 * Icons are loaded lazily from assets/icons for optimal performance.
 */
const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Icon component provides a unified way to use SVG icons with lazy loading. It is compatible with MUI Icon API and can be used with IconButton and other MUI components.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: [
        'info',
        'checkmark',
        'chevron-left',
        'chevron-right',
        'chevron-down',
        'chevron-up',
        'arrow-up',
        'arrow-down',
        'star',
        'activity',
        'arrow-down-right',
        'arrow-up-right',
        'bank',
        'chat',
        'check-circle',
        'check-stamp',
        'close',
        'data-flow',
        'data-stack',
        'data-transfer',
        'dollar-circle',
        'filter',
        'menu',
        'minus-circle',
        'plus-circle',
        'search',
        'search-success',
        'security',
        'sorting',
        'stat-down',
        'stat-up',
        'tools',
        'warning',
        'warning-triangle',
      ],
      description: 'Name of the icon from the icon registry',
    },
    fontSize: {
      control: 'select',
      options: ['inherit', 'small', 'medium', 'large'],
      description: 'Size of the icon',
    },
    color: {
      control: 'select',
      options: [
        'inherit',
        'action',
        'disabled',
        'primary',
        'secondary',
        'error',
        'info',
        'success',
        'warning',
      ],
      description: 'Color of the icon',
    },
    children: {
      control: false,
      description: 'Custom SVG content (overrides name if provided)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

/**
 * Basic icon usage
 */
export const Default: Story = {
  args: {
    name: 'info',
  },
};

/**
 * Icon with different sizes
 */
export const Sizes: Story = {
  args: { name: 'info' },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Icon {...args} fontSize="small" />
      <Icon {...args} fontSize="medium" />
      <Icon {...args} fontSize="large" />
    </div>
  ),
};

/**
 * Icon with different colors
 */
export const Colors: Story = {
  args: { name: 'info' },
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <Icon {...args} color="primary" />
      <Icon {...args} color="secondary" />
      <Icon {...args} color="error" />
      <Icon {...args} color="success" />
      <Icon {...args} color="warning" />
    </div>
  ),
};

/**
 * All available icons
 */
export const AllIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="info" />
        <span>info</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="checkmark" />
        <span>checkmark</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="chevron-left" />
        <span>chevron-left</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="chevron-right" />
        <span>chevron-right</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="chevron-down" />
        <span>chevron-down</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="chevron-up" />
        <span>chevron-up</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="arrow-up" />
        <span>arrow-up</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="arrow-down" />
        <span>arrow-down</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="star" />
        <span>star</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="activity" />
        <span>activity</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="arrow-down-right" />
        <span>arrow-down-right</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="arrow-up-right" />
        <span>arrow-up-right</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="bank" />
        <span>bank</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="chat" />
        <span>chat</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="check-circle" />
        <span>check-circle</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="check-stamp" />
        <span>check-stamp</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="close" />
        <span>close</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="data-flow" />
        <span>data-flow</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="data-stack" />
        <span>data-stack</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="data-transfer" />
        <span>data-transfer</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="dollar-circle" />
        <span>dollar-circle</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="filter" />
        <span>filter</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="menu" />
        <span>menu</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="minus-circle" />
        <span>minus-circle</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="plus-circle" />
        <span>plus-circle</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="search" />
        <span>search</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="search-success" />
        <span>search-success</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="security" />
        <span>security</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="sorting" />
        <span>sorting</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="stat-down" />
        <span>stat-down</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="stat-up" />
        <span>stat-up</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="tools" />
        <span>tools</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="warning-hexagon" />
        <span>warning-hexagon</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Icon name="warning-triangle" />
        <span>warning-triangle</span>
      </div>
    </div>
  ),
};

/**
 * Icon with custom SVG content
 */
export const CustomSvg: Story = {
  args: {
    name: 'info', // Provide required name prop for type safety, but children will override rendering
    children: (
      <>
        <path d="M12 2L2 7L12 12L22 7L12 2Z" />
        <path d="M2 17L12 22L22 17" />
        <path d="M2 12L12 17L22 12" />
      </>
    ),
  },
};

/**
 * Icon used with MUI IconButton (demonstrates compatibility)
 */
export const WithIconButton: Story = {
  args: { name: 'info' },
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <IconButton aria-label="Info">
        <Icon {...args} />
      </IconButton>
      <IconButton aria-label="Info Primary" color="primary">
        <Icon {...args} />
      </IconButton>
      <IconButton aria-label="Info Secondary" color="secondary">
        <Icon {...args} />
      </IconButton>
    </div>
  ),
};

/**
 * Icon with custom styling (MUI sx prop is not supported; use inline style or css prop)
 */
export const CustomStyling: Story = {
  args: { name: 'info' },
  render: (args) => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Icon
        {...args}
        style={{
          fontSize: 40,
          color: colors.semantic.success,
        }}
      />
      <Icon
        {...args}
        style={{
          fontSize: 32,
          color: '#ff0000',
        }}
      />
    </div>
  ),
};
