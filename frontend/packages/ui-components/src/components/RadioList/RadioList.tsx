/** @jsxImportSource @emotion/react */
'use client';

import * as styles from './RadioList.styles';

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioListProps {
  /**
   * Array of radio options
   */
  options: RadioOption[];
  
  /**
   * Currently selected value (empty string means nothing selected)
   */
  value: string;
  
  /**
   * Callback when selection changes
   */
  onChange: (value: string) => void;
  
  /**
   * Optional name for radio group
   */
  name?: string;
  
  /**
   * Allow deselection by clicking the already selected option
   * @default false
   */
  allowDeselect?: boolean;
}

/**
 * RadioList - A list of radio options for selection
 * 
 * @example
 * ```tsx
 * <RadioList
 *   options={[
 *     { value: 'pol-high', label: 'PoL High to Low' },
 *     { value: 'pol-low', label: 'PoL Low to High' },
 *   ]}
 *   value={selectedValue}
 *   onChange={setSelectedValue}
 * />
 * ```
 */
export default function RadioList({
  options,
  value,
  onChange,
  name = 'radio-list',
  allowDeselect = false,
}: RadioListProps) {
  return (
    <div css={styles.list}>
      {options.map((option) => (
        <label key={option.value} css={styles.item}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => {
              // Allow deselection only if allowDeselect is true
              if (allowDeselect && value === option.value) {
                onChange('');
              } else {
                onChange(option.value);
              }
            }}
            css={styles.radioInput}
          />
          <span css={styles.radioCustom}>
            {value === option.value && <span css={styles.radioInner} />}
          </span>
          <span css={styles.label}>{option.label}</span>
        </label>
      ))}
    </div>
  );
}

