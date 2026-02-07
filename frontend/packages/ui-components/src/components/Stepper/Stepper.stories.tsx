import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from '@storybook/test';
import Stepper from './Stepper';
import React, { useState } from 'react';
import { colors } from '../../theme/styleSystem';

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Steppers convey progress through numbered steps. They provide a wizard-like workflow and support horizontal orientation, linear/non-linear flows, optional steps, and error states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    steps: {
      control: 'object',
      description: 'Array of step objects with label, description, optional, and error properties',
    },
    activeStep: {
      control: 'number',
      description: 'The index (zero-based) of the currently active step',
    },
    alternativeLabel: {
      control: 'boolean',
      description: 'If true, labels are placed below step icons',
    },
    nonLinear: {
      control: 'boolean',
      description: 'If true, allows clicking on steps to navigate non-linearly',
    },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    steps: [
      { label: 'Select campaign settings' },
      { label: 'Create an ad group' },
      { label: 'Create an ad' },
    ],
    activeStep: 1,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Select campaign settings')).toBeInTheDocument();
    expect(canvas.getByText('Create an ad group')).toBeInTheDocument();
    expect(canvas.getByText('Create an ad')).toBeInTheDocument();
    
    // Verify all 3 steps are rendered by counting step labels
    const stepLabels = [
      canvas.getByText('Select campaign settings'),
      canvas.getByText('Create an ad group'),
      canvas.getByText('Create an ad'),
    ];
    expect(stepLabels).toHaveLength(3);
  },
};

export const Linear: Story = {
  args: {
    steps: [
      { label: 'Select campaign settings' },
      { label: 'Create an ad group', optional: true },
      { label: 'Create an ad' },
    ],
    activeStep: 1,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Select campaign settings')).toBeInTheDocument();
    expect(canvas.getByText('Create an ad group')).toBeInTheDocument();
    expect(canvas.getByText('Create an ad')).toBeInTheDocument();
    
    const optionalText = canvas.getByText('Optional');
    expect(optionalText).toBeInTheDocument();
    expect(optionalText).toBeVisible();
  },
};

export const NonLinear: Story = {
  args: {
    steps: [
      { label: 'Select campaign settings' },
      { label: 'Create an ad group' },
      { label: 'Create an ad' },
    ],
    activeStep: 0,
    nonLinear: true,
  },
  render: (args) => {
    const NonLinearWrapper = () => {
      const [activeStep, setActiveStep] = useState(args.activeStep);

      return (
        <div style={{ width: '600px' }}>
          <Stepper
            {...args}
            activeStep={activeStep}
            onStepClick={(step) => setActiveStep(step)}
          />
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p>Active Step: {activeStep + 1}</p>
            <button onClick={() => setActiveStep(Math.max(0, activeStep - 1))}>
              Back
            </button>
            {' '}
            <button onClick={() => setActiveStep(Math.min(args.steps.length - 1, activeStep + 1))}>
              Next
            </button>
          </div>
        </div>
      );
    };

    return <NonLinearWrapper />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Active Step: 1')).toBeVisible();
    
    const nextButton = canvas.getByRole('button', { name: 'Next' });
    const backButton = canvas.getByRole('button', { name: 'Back' });
    
    expect(nextButton).toBeInTheDocument();
    expect(backButton).toBeInTheDocument();
    
    await userEvent.click(nextButton);
    
    await waitFor(() => {
      expect(canvas.getByText('Active Step: 2')).toBeVisible();
    });
    
    await userEvent.click(nextButton);
    
    await waitFor(() => {
      expect(canvas.getByText('Active Step: 3')).toBeVisible();
    });
    
    await userEvent.click(backButton);
    
    await waitFor(() => {
      expect(canvas.getByText('Active Step: 2')).toBeVisible();
    });
  },
};

export const AlternativeLabel: Story = {
  args: {
    steps: [
      { label: 'Select master blaster campaign settings' },
      { label: 'Create an ad group' },
      { label: 'Create an ad' },
    ],
    activeStep: 1,
    alternativeLabel: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Select master blaster campaign settings')).toBeInTheDocument();
    expect(canvas.getByText('Create an ad group')).toBeInTheDocument();
    expect(canvas.getByText('Create an ad')).toBeInTheDocument();
    
    // Verify all 3 steps are rendered by counting step labels
    const stepLabels = [
      canvas.getByText('Select master blaster campaign settings'),
      canvas.getByText('Create an ad group'),
      canvas.getByText('Create an ad'),
    ];
    expect(stepLabels).toHaveLength(3);
  },
};

export const WithOptional: Story = {
  args: {
    steps: [
      { label: 'Select campaign settings' },
      { label: 'Create an ad group', optional: true },
      { label: 'Create an ad', optional: true },
    ],
    activeStep: 1,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Select campaign settings')).toBeInTheDocument();
    expect(canvas.getByText('Create an ad group')).toBeInTheDocument();
    expect(canvas.getByText('Create an ad')).toBeInTheDocument();
    
    const optionalTexts = canvas.getAllByText('Optional');
    expect(optionalTexts).toHaveLength(2);
  },
};

export const Interactive: Story = {
  args: {
    steps: [
      { label: 'Project Info' },
      { label: 'Telegram Group' },
      { label: 'Review & Submit' },
    ],
    activeStep: 0,
  },
  render: (args) => {
    const InteractiveWrapper = () => {
      const [activeStep, setActiveStep] = useState(args.activeStep);

      const handleNext = () => {
        setActiveStep((prev) => Math.min(args.steps.length - 1, prev + 1));
      };

      const handleBack = () => {
        setActiveStep((prev) => Math.max(0, prev - 1));
      };

      return (
        <div style={{ width: '600px' }}>
          <Stepper
            {...args}
            activeStep={activeStep}
          />
          <div style={{ marginTop: '32px', padding: '24px', background: colors.background.light, borderRadius: '8px' }}>
            <h3>Step {activeStep + 1}: {args.steps[activeStep].label}</h3>
            <p>Content for {args.steps[activeStep].label} goes here.</p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <button onClick={handleBack} disabled={activeStep === 0}>
                Back
              </button>
              <button onClick={handleNext} disabled={activeStep === args.steps.length - 1}>
                {activeStep === args.steps.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      );
    };

    return <InteractiveWrapper />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    expect(canvas.getByText('Step 1: Project Info')).toBeVisible();
    expect(canvas.getByText('Content for Project Info goes here.')).toBeVisible();
    
    const nextButton = canvas.getByRole('button', { name: 'Next' });
    const backButton = canvas.getByRole('button', { name: 'Back' });
    
    expect(backButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
    
    await userEvent.click(nextButton);
    
    await waitFor(() => {
      expect(canvas.getByText('Step 2: Telegram Group')).toBeVisible();
      expect(canvas.getByText('Content for Telegram Group goes here.')).toBeVisible();
    });
    
    expect(backButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
    
    await userEvent.click(nextButton);
    
    await waitFor(() => {
      expect(canvas.getByText('Step 3: Review & Submit')).toBeVisible();
      expect(canvas.getByText('Content for Review & Submit goes here.')).toBeVisible();
    });
    
    const finishButton = canvas.getByRole('button', { name: 'Finish' });
    expect(finishButton).toBeDisabled();
    expect(backButton).not.toBeDisabled();
    
    await userEvent.click(backButton);
    
    await waitFor(() => {
      expect(canvas.getByText('Step 2: Telegram Group')).toBeVisible();
    });
  },
};