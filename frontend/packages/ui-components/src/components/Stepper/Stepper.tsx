/** @jsxImportSource @emotion/react */
'use client';
import React from 'react';
import * as styles from './Stepper.styles';

export interface StepProps {
  label: string;
  description?: string;
  optional?: boolean;
  error?: boolean;
}

export interface StepperProps {
  steps: StepProps[];
  activeStep: number;
  alternativeLabel?: boolean;
  nonLinear?: boolean;
  onStepClick?: (step: number) => void;
  className?: string;
}

const Stepper: React.FC<StepperProps> = ({
  steps,
  activeStep,
  alternativeLabel = false,
  nonLinear = false,
  onStepClick,
  className,
}) => {
  const handleStepClick = (index: number) => {
    if (nonLinear && onStepClick) {
      onStepClick(index);
    }
  };

  const getStepStatus = (index: number) => {
    if (index < activeStep) return 'completed';
    if (index === activeStep) return 'active';
    return 'inactive';
  };

  return (
    <div
      css={[
        alternativeLabel
          ? styles.stepperHorizontalAlt
          : styles.stepperHorizontal,
      ]}
      className={className}
    >
      {steps.map((step, index) => {
        const status = getStepStatus(index);
        const isLast = index === steps.length - 1;
        const isClickable = nonLinear && onStepClick;

        return (
          <div
            key={index}
            css={[
              alternativeLabel
                ? styles.stepWrapperHorizontalAlt
                : styles.stepWrapperHorizontal,
            ]}
          >
            <div
              css={[
                alternativeLabel
                  ? styles.stepContainerHorizontalAlt
                  : styles.stepContainerHorizontal,
              ]}
            >
              <div
                css={[
                  styles.stepIconWrapper,
                  isClickable && styles.stepClickable,
                ]}
                onClick={() => handleStepClick(index)}
              >
                <div
                  css={[
                    styles.stepIcon,
                    status === 'active' && styles.stepIconActive,
                    status === 'completed' && styles.stepIconCompleted,
                    status === 'inactive' && styles.stepIconInactive,
                  ]}
                >
                  {status === 'completed' ? (
                    <span css={styles.checkmark}>✓</span>
                  ) : (
                    <span css={styles.stepNumber}>{index + 1}</span>
                  )}
                </div>
              </div>

              <div
                css={[
                  alternativeLabel
                    ? styles.stepLabelAlt
                    : styles.stepLabel,
                ]}
              >
                <span
                  css={[
                    styles.stepLabelText,
                    status === 'active' && styles.stepLabelActive,
                    status === 'inactive' && styles.stepLabelInactive,
                  ]}
                >
                  {step.label}
                </span>
                {step.optional && (
                  <span css={styles.stepOptional}>Optional</span>
                )}
              </div>
            </div>

            {!isLast && (
              <div
                css={[
                  alternativeLabel
                    ? styles.connectorHorizontalAlt
                    : styles.connectorHorizontal,
                  status === 'completed' && styles.connectorCompleted,
                ]}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;