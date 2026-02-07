/** @jsxImportSource @emotion/react */
'use client';

import { useState } from 'react';
import { Select, MenuItem, SelectChangeEvent, Checkbox } from '@mui/material';
import Icon from '../Icon/Icon';
import * as styles from './MultiSelect.styles';

export interface MultiSelectOption {
  value: string;
  label: string;
  count?: number;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * MultiSelect Component
 *
 * A multi-select dropdown component with custom styling
 *
 * @param options - Array of options to display
 * @param value - Array of selected values
 * @param onChange - Callback when selection changes
 * @param placeholder - Placeholder text when no selection
 * @param disabled - Whether the select is disabled
 */
export default function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const selectedValue = event.target.value;
    onChange(typeof selectedValue === 'string' ? [selectedValue] : selectedValue);
  };

  const renderValue = (selected: string[]) => {
    return (
        <span css={styles.placeholder}>
            {placeholder}
            {selected.length > 0 && (
                <span css={styles.selectedValuesChip}>
                    {selected.length}
                </span>
            )}
        </span>
    );
  };

  return (
    <div css={styles.container}>
      <Select
        multiple
        value={value}
        onChange={handleChange}
        displayEmpty
        renderValue={renderValue}
        disabled={disabled}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        css={styles.select}
        IconComponent={() => (
          <Icon 
            name={open ? 'chevron-up' : 'chevron-down'} 
            css={styles.selectIcon}
          />
        )}
        MenuProps={{
          sx: styles.selectMenuStyles,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
              <Checkbox
                checked={value.includes(option.value)}
                onChange={handleChange}
                css={styles.checkbox}
              />
              <span css={styles.optionLabel}>
                {option.label}
                {option.count !== undefined && (
                  <span css={styles.optionCount}>{option.count}</span>
                )}
              </span>
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}

