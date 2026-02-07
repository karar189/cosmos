/** @jsxImportSource @emotion/react */
'use client';

import * as styles from './Step.styles';
import Step from './Step';

interface StepItem {
  title: string;
}

interface StepperProps {
  steps: StepItem[];
}

export default function Stepper({ steps }: StepperProps) {
  return (
    <div css={styles.container}>
      <div css={styles.stepList}>
        {steps.map((item, index) => (
          <Step
            key={index}
            index={index}
            title={item.title}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
