/** @jsxImportSource @emotion/react */
'use client';

import { useState, useRef, useEffect } from 'react';
import type { BadgeColor, BadgeSize } from '../Badge';
import * as styles from './BadgeSelect.styles';
import Badge from '../Badge';
import { Icon } from '../../Icon';

export interface BadgeSelectOption {
  value: string;
  label: string;
}

export interface BadgeSelectProps {
  options: BadgeSelectOption[];
  value: string;
  onChange: (value: string) => void;
  color: BadgeColor;
  size?: BadgeSize;
}

export default function BadgeSelect({
  options,
  value,
  onChange,
  color,
  size = 'medium',
}: BadgeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption?.label || value;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div css={styles.dropdownContainer} ref={dropdownRef}>
      <button css={styles.button} onClick={() => setIsOpen(!isOpen)}>
        <Badge
          color={color}
          size={size}
          iconComponent={<Icon name="chevron-down" />}
          iconPosition="right"
        >
          {displayLabel}
        </Badge>
      </button>

      {isOpen && (
        <div css={styles.getDropdownMenuStyles({ color })}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              css={[
                styles.getDropdownItemStyles({ color }),
                option.value === value && styles.dropdownItemActive,
              ]}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
