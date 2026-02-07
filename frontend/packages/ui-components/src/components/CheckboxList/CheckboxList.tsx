/** @jsxImportSource @emotion/react */
'use client';

import { Icon } from '../Icon';
import * as styles from './CheckboxList.styles';

export interface CheckboxOption {
  value: string;
  label: string;
  count?: number;
}

export interface CheckboxListProps {
  options: CheckboxOption[];
  value: string[];
  onChange: (value: string[]) => void;
  name?: string;
}

export default function CheckboxList({
  options,
  value,
  onChange,
  name = 'checkbox-list',
}: CheckboxListProps) {
  const handleChange = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div css={styles.list}>
      {options.map((option) => (
        <label key={option.value} css={styles.item}>
          <input
            type="checkbox"
            name={name}
            value={option.value}
            checked={value.includes(option.value)}
            onChange={() => handleChange(option.value)}
            css={styles.checkboxInput}
          />
          <span css={styles.checkboxCustom}>
            <Icon name="checkmark" />
          </span>
          <span css={styles.label}>{option.label}</span>
          {option.count !== undefined && (
            <span css={styles.count}>{option.count}</span>
          )}
        </label>
      ))}
    </div>
  );
}

