/** @jsxImportSource @emotion/react */
'use client';

import { useState } from 'react';
import * as styles from './SegmentedControl.styles';

export interface SegmentedControlOption {
  label: string;
  value: string;
}

export interface SegmentedControlProps {
  /**
   * Available options
   */
  options: SegmentedControlOption[];
  /**
   * Currently selected value
   */
  value?: string;
  /**
   * Default selected value
   */
  defaultValue?: string;
  /**
   * Change handler
   */
  onChange?: (value: string) => void;
  /**
   * Additional CSS class name
   */
  className?: string;
}

export default function SegmentedControl({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  className,
}: SegmentedControlProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue || options[0]?.value);
  
  const selectedValue = controlledValue !== undefined ? controlledValue : uncontrolledValue;

  const handleClick = (value: string) => {
    if (controlledValue === undefined) {
      setUncontrolledValue(value);
    }
    onChange?.(value);
  };

  return (
    <div css={styles.container} className={className} data-testid="segmented-control">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          css={[
            styles.button,
            selectedValue === option.value && styles.buttonActive,
          ]}
          onClick={() => handleClick(option.value)}
          aria-pressed={selectedValue === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
