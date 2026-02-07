import type { Meta } from '@storybook/react';
import { expect, within } from '@storybook/test';
import React from 'react';
import GradientBackground from './GradientBackground';
import { CardContainer } from '../Card';
import { colors } from '../../theme/styleSystem';

/**
 * GradientBackground provides a beige background with radial gradient overlay
 */
const meta = {
  title: 'Components/GradientBackground',
  component: GradientBackground,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A decorative background component with beige color and radial gradient overlay. Used for special sections like submit data forms.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof GradientBackground>;

export default meta;

/**
 * Default gradient background with card content
 * Tests:
 * - Renders children content correctly
 * - Text content is visible and accessible
 * - Card container is present
 */
export const Default = {
  render: () => (
    <GradientBackground>
      <CardContainer paddingSize="l">
        <h2 style={{ margin: 0, fontSize: '24px', fontFamily: 'Aeonik', fontWeight: 500 }}>
          Submit Data
        </h2>
        <p style={{ margin: 0, fontSize: '16px', color: colors.text.secondary }}>
          This is a card inside the gradient background.
        </p>
        <p style={{ margin: 0, fontSize: '16px', color: colors.text.secondary }}>
          The gradient creates a subtle visual effect while maintaining readability.
        </p>
      </CardContainer>
    </GradientBackground>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check that heading is rendered and visible
    const heading = canvas.getByRole('heading', { name: 'Submit Data' });
    expect(heading).toBeInTheDocument();
    expect(heading).toBeVisible();

    // Check that paragraph content is rendered
    expect(canvas.getByText(/This is a card inside the gradient background/i)).toBeInTheDocument();
    expect(canvas.getByText(/The gradient creates a subtle visual effect/i)).toBeInTheDocument();
  },
};

/**
 * Gradient background with multiple cards
 * Tests:
 * - Multiple children render correctly
 * - All cards are visible
 * - Content hierarchy is maintained
 */
export const MultipleCards = {
  render: () => (
    <GradientBackground>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
        <CardContainer>
          <h3>Card 1</h3>
          <p>First card with default padding (16px)</p>
        </CardContainer>
        <CardContainer paddingSize="l">
          <h3>Card 2</h3>
          <p>Second card with large padding (24px)</p>
        </CardContainer>
        <CardContainer>
          <h3>Card 3</h3>
          <p>Third card demonstrating multiple cards in gradient background</p>
        </CardContainer>
      </div>
    </GradientBackground>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check all three card headings are present
    expect(canvas.getByRole('heading', { name: 'Card 1' })).toBeInTheDocument();
    expect(canvas.getByRole('heading', { name: 'Card 2' })).toBeInTheDocument();
    expect(canvas.getByRole('heading', { name: 'Card 3' })).toBeInTheDocument();

    // Check card content text
    expect(canvas.getByText(/First card with default padding/i)).toBeInTheDocument();
    expect(canvas.getByText(/Second card with large padding/i)).toBeInTheDocument();
    expect(canvas.getByText(/Third card demonstrating multiple cards/i)).toBeInTheDocument();

    // Verify all cards are visible
    expect(canvas.getByRole('heading', { name: 'Card 1' })).toBeVisible();
    expect(canvas.getByRole('heading', { name: 'Card 2' })).toBeVisible();
    expect(canvas.getByRole('heading', { name: 'Card 3' })).toBeVisible();
  },
};

/**
 * Gradient background with form-like content
 * Tests:
 * - Form elements render correctly
 * - Input fields are accessible
 * - Labels are associated with inputs
 */
export const WithFormContent = {
  render: () => (
    <GradientBackground>
      <CardContainer paddingSize="l">
        <h2 style={{ margin: '0 0 16px 0', fontSize: '24px', fontFamily: 'Aeonik', fontWeight: 500 }}>
          Submit Data
        </h2>
        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="email-input" style={{ fontSize: '16px', color: colors.text.secondary, display: 'block', marginBottom: '8px' }}>
            Email Address
          </label>
          <input 
            id="email-input"
            type="email" 
            placeholder="your@email.com"
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '12px', 
              border: `1px solid ${colors.border.default}`,
              fontSize: '16px'
            }}
          />
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="message-input" style={{ fontSize: '16px', color: colors.text.secondary, display: 'block', marginBottom: '8px' }}>
            Message
          </label>
          <textarea 
            id="message-input"
            placeholder="Your message..."
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '12px', 
              border: `1px solid ${colors.border.default}`,
              fontSize: '16px',
              minHeight: '120px',
              fontFamily: 'Aeonik'
            }}
          />
        </div>
      </CardContainer>
    </GradientBackground>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check form heading
    expect(canvas.getByRole('heading', { name: 'Submit Data' })).toBeInTheDocument();

    // Check email input and label
    const emailLabel = canvas.getByText('Email Address');
    expect(emailLabel).toBeInTheDocument();
    
    const emailInput = canvas.getByPlaceholderText('your@email.com');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('id', 'email-input');

    // Check message textarea and label
    const messageLabel = canvas.getByText('Message');
    expect(messageLabel).toBeInTheDocument();
    
    const messageInput = canvas.getByPlaceholderText('Your message...');
    expect(messageInput).toBeInTheDocument();
    expect(messageInput.tagName).toBe('TEXTAREA');
    expect(messageInput).toHaveAttribute('id', 'message-input');

    // Verify inputs are visible and enabled
    expect(emailInput).toBeVisible();
    expect(emailInput).toBeEnabled();
    expect(messageInput).toBeVisible();
    expect(messageInput).toBeEnabled();
  },
};