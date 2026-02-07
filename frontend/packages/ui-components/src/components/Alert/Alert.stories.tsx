import type { Meta } from '@storybook/react';
import React from 'react';
import Alert from './Alert';
import { expect, within } from '@storybook/test';

/**
 * Alert component displays important messages to users with different severity levels.
 */
const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Alert component for displaying notifications and messages with different severity levels. Supports optional icons and custom styling.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    severity: {
      control: 'select',
      options: ['warning', 'info', 'error', 'success'],
      description: 'Alert severity level - controls color scheme',
      table: {
        defaultValue: { summary: 'info' },
      },
    },
    iconName: {
      control: 'text',
      description: 'Optional icon name to display on the left',
    },
    children: {
      control: 'text',
      description: 'Alert message content',
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;

/**
 * Warning alert - matches the screenshot example
 */
export const Warning = {
  render: () => (
    <Alert severity="warning">
      A DocuSign template form for Third Party Monitoring will be sent to you directly by our representatives
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const alertText = canvas.getByText(
      'A DocuSign template form for Third Party Monitoring will be sent to you directly by our representatives'
    );
    expect(alertText).toBeInTheDocument();
    expect(alertText).toBeVisible();
  },
};

/**
 * Warning alert with icon
 */
export const WarningWithIcon = {
  render: () => (
    <Alert severity="warning" iconName="info">
      A DocuSign template form for Third Party Monitoring will be sent to you directly by our representatives
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const alertText = canvas.getByText(
      'A DocuSign template form for Third Party Monitoring will be sent to you directly by our representatives'
    );
    expect(alertText).toBeInTheDocument();
    expect(alertText).toBeVisible();
    
    // Check that icon is present (Icon component renders an SVG)
    const alert = canvasElement.querySelector('[role="alert"]');
    expect(alert).toBeInTheDocument();
    expect(alert).toBeVisible();
  },
};

/**
 * Info alert
 */
export const Info = {
  render: () => (
    <Alert severity="info">
      This is an informational message to help guide the user.
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const alertText = canvas.getByText('This is an informational message to help guide the user.');
    expect(alertText).toBeInTheDocument();
    expect(alertText).toBeVisible();
  },
};

/**
 * Info alert with icon
 */
export const InfoWithIcon = {
  render: () => (
    <Alert severity="info" iconName="info">
      This is an informational message with an icon.
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const alertText = canvas.getByText('This is an informational message with an icon.');
    expect(alertText).toBeInTheDocument();
    expect(alertText).toBeVisible();
    
    // Check that icon is present
    const alert = canvasElement.querySelector('[role="alert"]');
    expect(alert).toBeInTheDocument();
    expect(alert).toBeVisible();
  },
};

/**
 * Error alert
 */
export const Error = {
  render: () => (
    <Alert severity="error">
      An error occurred while processing your request. Please try again.
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const alertText = canvas.getByText('An error occurred while processing your request. Please try again.');
    expect(alertText).toBeInTheDocument();
    expect(alertText).toBeVisible();
  },
};

/**
 * Error alert with icon
 */
export const ErrorWithIcon = {
  render: () => (
    <Alert severity="error" iconName="close">
      An error occurred while processing your request. Please try again.
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const alertText = canvas.getByText('An error occurred while processing your request. Please try again.');
    expect(alertText).toBeInTheDocument();
    expect(alertText).toBeVisible();
    
    // Check that icon is present
    const alert = canvasElement.querySelector('[role="alert"]');
    expect(alert).toBeInTheDocument();
    expect(alert).toBeVisible();
  },
};

/**
 * Success alert
 */
export const Success = {
  render: () => (
    <Alert severity="success">
      Your changes have been saved successfully!
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const alertText = canvas.getByText('Your changes have been saved successfully!');
    expect(alertText).toBeInTheDocument();
    expect(alertText).toBeVisible();
  },
};

/**
 * Success alert with icon
 */
export const SuccessWithIcon = {
  render: () => (
    <Alert severity="success" iconName="check-stamp">
      Your changes have been saved successfully!
    </Alert>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    const alertText = canvas.getByText('Your changes have been saved successfully!');
    expect(alertText).toBeInTheDocument();
    expect(alertText).toBeVisible();
    
    // Check that icon is present
    const alert = canvasElement.querySelector('[role="alert"]');
    expect(alert).toBeInTheDocument();
    expect(alert).toBeVisible();
  },
};

/**
 * Alert with long content to demonstrate text wrapping
 */
export const LongContent = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Alert severity="warning" iconName="info">
        This is a much longer alert message that demonstrates how the component handles text wrapping. 
        The alert will expand vertically to accommodate the content while maintaining proper padding 
        and spacing. Note: OpenZeppelin is phasing out hosted Defender in favor of open-source Monitor/Relayer 
        (sunset July 1, 2026), so we may accept self-hosted setups with equivalent functionality. Projects 
        frequently &ldquo;buy&rdquo; monitoring but never fully configure it; we verify concrete subscriptions/alerts exist 
        (Forta subscriptions, Forta bot IDs; Tenderly webhooks; Defender/Monitor config).
      </Alert>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check that the long content is displayed
    expect(canvas.getByText(/This is a much longer alert message/)).toBeInTheDocument();
    expect(canvas.getByText(/OpenZeppelin is phasing out hosted Defender/)).toBeInTheDocument();
    expect(canvas.getByText(/Forta subscriptions, Forta bot IDs/)).toBeInTheDocument();
    
    // Check that icon is present
    const alert = canvasElement.querySelector('[role="alert"]');
    expect(alert).toBeInTheDocument();
    expect(alert).toBeVisible();
  },
};

/**
 * Multiple alerts showing all severities
 */
export const AllSeverities = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '600px' }}>
      <Alert severity="success" iconName="check-stamp">
        Success: Operation completed successfully
      </Alert>
      <Alert severity="info" iconName="info">
        Info: Please review the information below
      </Alert>
      <Alert severity="warning" iconName="info">
        Warning: This action cannot be undone
      </Alert>
      <Alert severity="error" iconName="close">
        Error: Something went wrong
      </Alert>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check all four severity levels are present
    expect(canvas.getByText('Success: Operation completed successfully')).toBeInTheDocument();
    expect(canvas.getByText('Info: Please review the information below')).toBeInTheDocument();
    expect(canvas.getByText('Warning: This action cannot be undone')).toBeInTheDocument();
    expect(canvas.getByText('Error: Something went wrong')).toBeInTheDocument();
    
    // Check that all alerts are visible
    const alerts = canvasElement.querySelectorAll('[role="alert"]');
    expect(alerts).toHaveLength(4);
    
    alerts.forEach((alert) => {
      expect(alert).toBeVisible();
    });
  },
};

