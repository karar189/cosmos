/** @jsxImportSource @emotion/react */
'use client';

import { useState } from 'react';
import { Select as MuiSelect, MenuItem, SelectChangeEvent } from '@mui/material';
import Icon from '../Icon/Icon';
import * as styles from './Select.styles';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

/**
 * Select Component
 *
 * A single-select dropdown component with custom styling
 *
 * @param options - Array of options to display
 * @param value - Selected value
 * @param onChange - Callback when selection changes
 * @param placeholder - Placeholder text when no selection
 * @param disabled - Whether the select is disabled
 */
export default function Select({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  ariaLabel,
}: SelectProps) {
  const [open, setOpen] = useState(false);

  const handleChange = (event: SelectChangeEvent<string | number>) => {
    onChange(event.target.value);
  };

  const renderValue = (selected: string | number) => {
    if (selected === '' || selected === undefined) {
      return <span css={styles.placeholder}>{placeholder}</span>;
    }
    const option = options.find((opt) => opt.value === selected);
    return <span css={styles.placeholder}>{option?.label || selected}</span>;
  };

  return (
    <div css={styles.container}>
      <MuiSelect
        value={value}
        onChange={handleChange}
        displayEmpty
        renderValue={renderValue}
        disabled={disabled}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        css={styles.select}
        inputProps={{
          'aria-label': ariaLabel,
        }}
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
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
    </div>
  );
}

