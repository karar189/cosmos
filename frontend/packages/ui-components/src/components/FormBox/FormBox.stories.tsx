import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from '@storybook/test';
import FormBox from './FormBox';
import { colors } from '../../theme/styleSystem';

/**
 * FormBox is a standardized container component used throughout the project for form layouts.
 */
const meta = {
  title: 'Form/Layout',
  component: FormBox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A reusable form container with fixed dimensions (912×1016px), rounded corners, and beige background. Features consistent padding and vertical spacing with justify-content: space-between for optimal form layout.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Content to be rendered inside the FormBox',
    },
  },
} satisfies Meta<typeof FormBox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default FormBox with simple text content
 * Tests:
 * - FormBox renders correctly
 * - Footer text is displayed
 * - Contact link is present and clickable
 */
export const Default: Story = {
  args: {
    children: 'FormBox Content',
    footer: 'Have Issues?',
    boldText: 'Contact us',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check that content is rendered
    expect(canvas.getByText('FormBox Content')).toBeInTheDocument();

    // Check footer text is present
    expect(canvas.getByText('Have Issues?')).toBeInTheDocument();

    // Check contact link is present
    const contactLink = canvas.getByRole('link', { name: 'Contact us' });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute('href', '/');
  },
};

/**
 * FormBox without footer
 * Tests:
 * - FormBox renders when footer is not provided
 * - No footer elements are present
 */
export const WithoutFooter = {
  render: () => (
    <FormBox footer="">
      <div style={{ padding: '20px' }}>
        <h2>Form Title</h2>
        <p>This form has no footer</p>
      </div>
    </FormBox>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check content is rendered
    expect(canvas.getByText('Form Title')).toBeInTheDocument();
    expect(canvas.getByText('This form has no footer')).toBeInTheDocument();

    // Check that footer elements are not present
    expect(canvas.queryByText('Have issues?')).not.toBeInTheDocument();
    expect(canvas.queryByRole('link', { name: /Contact/i })).not.toBeInTheDocument();
  },
};

/**
 * FormBox with header (email and back button)
 * Tests:
 * - Header renders correctly
 * - Email is displayed
 * - Back button is present and clickable
 */
const WithHeaderComponent = () => {
  const [backClicked, setBackClicked] = useState(false);

  return (
    <div>
      <FormBox
        headerProps={{
          email: 'user@example.com',
          backText: 'Change account type',
          onBackClick: () => setBackClicked(true),
        }}
        footer="Have Issues?"
        boldText="Contact us"
      >
        <div style={{ padding: '20px' }}>
          <h2>Form with Header</h2>
          {backClicked && <p>Back button clicked!</p>}
        </div>
      </FormBox>
    </div>
  );
};

export const WithHeader = {
  render: () => <WithHeaderComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check header email is displayed
    expect(canvas.getByText('user@example.com')).toBeInTheDocument();

    // Check back button with text
    expect(canvas.getByText('Change account type')).toBeInTheDocument();

    // Check avatar with first letter of email
    const avatar = canvas.getByText('U'); // First letter of "user@example.com"
    expect(avatar).toBeInTheDocument();

    // Click back button
    const backButton = canvas.getByRole('button', { name: 'Go back' });
    expect(backButton).toBeInTheDocument();
    await userEvent.click(backButton);

    // Check that callback was triggered
    await waitFor(() => {
      expect(canvas.getByText('Back button clicked!')).toBeInTheDocument();
    });
  },
};

/**
 * FormBox with complex form content
 * Tests:
 * - Handles complex children content
 * - Multiple form elements render correctly
 */
export const WithFormContent = {
  render: () => (
    <FormBox
      headerProps={{
        email: 'user@company.com',
        backText: 'Go back',
      }}
      footer="Need assistance?"
      boldText="Contact Support"
    >
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ margin: 0 }}>Registration Form</h2>
        
        <div>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '4px' }}>Full Name</label>
          <input 
            id="name"
            type="text" 
            placeholder="Enter your name" 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: `1px solid ${colors.neutral.gray300}` }}
          />
        </div>
        
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '4px' }}>Email</label>
          <input 
            id="email"
            type="email" 
            placeholder="your@email.com" 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: `1px solid ${colors.neutral.gray300}` }}
          />
        </div>
        
        <div>
          <label htmlFor="company" style={{ display: 'block', marginBottom: '4px' }}>Company</label>
          <input 
            id="company"
            type="text" 
            placeholder="Company name" 
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: `1px solid ${colors.neutral.gray300}` }}
          />
        </div>
        
        <button 
          style={{ 
            width: '100%', 
            padding: '12px', 
            background: colors.background.dark, 
            color: colors.neutral.white, 
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Submit
        </button>
      </div>
    </FormBox>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check header
    expect(canvas.getByText('user@company.com')).toBeInTheDocument();
    expect(canvas.getByText('Go back')).toBeInTheDocument();

    // Check form title
    expect(canvas.getByText('Registration Form')).toBeInTheDocument();

    // Check form fields
    expect(canvas.getByLabelText('Full Name')).toBeInTheDocument();
    expect(canvas.getByLabelText('Email')).toBeInTheDocument();
    expect(canvas.getByLabelText('Company')).toBeInTheDocument();

    // Check placeholders
    expect(canvas.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    expect(canvas.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    expect(canvas.getByPlaceholderText('Company name')).toBeInTheDocument();

    // Check submit button
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeInTheDocument();

    // Check footer
    expect(canvas.getByText('Need assistance?')).toBeInTheDocument();
    expect(canvas.getByRole('link', { name: 'Contact Support' })).toBeInTheDocument();
  },
};

/**
 * Interactive demo with multiple interactions
 * Tests:
 * - Back button interaction
 * - Form submission
 * - Multiple interactive elements
 */
const InteractiveDemoComponent = () => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  return (
    <FormBox
      headerProps={{
        email: 'demo@example.com',
        backText: step === 'success' ? 'Back to form' : undefined,
        onBackClick: () => setStep('form'),
      }}
      footer="Need help?"
      boldText="Contact us"
    >
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {step === 'form' ? (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ margin: 0 }}>Contact Form</h2>
            
            <div>
              <label htmlFor="demo-name" style={{ display: 'block', marginBottom: '4px' }}>Name</label>
              <input
                id="demo-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: `1px solid ${colors.neutral.gray300}` }}
                required
              />
            </div>
            
            <div>
              <label htmlFor="demo-email" style={{ display: 'block', marginBottom: '4px' }}>Email</label>
              <input
                id="demo-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your@email.com"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: `1px solid ${colors.neutral.gray300}` }}
                required
              />
            </div>
            
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                background: colors.background.dark,
                color: colors.neutral.white,
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Submit
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h2 style={{ margin: '0 0 16px 0', color: colors.semantic.success }}>Success!</h2>
            <p style={{ margin: 0, color: colors.text.secondary }}>
              Thank you, {formData.name}! We&apos;ll contact you at {formData.email}
            </p>
          </div>
        )}
      </div>
    </FormBox>
  );
};

export const InteractiveDemo = {
  render: () => <InteractiveDemoComponent />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Check initial state
    expect(canvas.getByText('Contact Form')).toBeInTheDocument();
    expect(canvas.getByLabelText('Name')).toBeInTheDocument();
    expect(canvas.getByLabelText('Email')).toBeInTheDocument();

    // Fill out form
    const nameInput = canvas.getByLabelText('Name');
    const emailInput = canvas.getByLabelText('Email');
    
    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');

    // Submit form
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    // Check success state
    await waitFor(() => {
      expect(canvas.getByText('Success!')).toBeInTheDocument();
      expect(canvas.getByText(/Thank you, John Doe!/)).toBeInTheDocument();
      expect(canvas.getByText(/john@example.com/)).toBeInTheDocument();
    });

    // Check back button appears
    expect(canvas.getByText('Back to form')).toBeInTheDocument();

    // Click back button
    const backButton = canvas.getByRole('button', { name: 'Go back' });
    await userEvent.click(backButton);

    // Check we're back to form
    await waitFor(() => {
      expect(canvas.getByText('Contact Form')).toBeInTheDocument();
    });
  },
};