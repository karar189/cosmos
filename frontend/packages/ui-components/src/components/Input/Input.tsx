/** @jsxImportSource @emotion/react */
'use client';

import React from 'react';
import * as styles from './Input.styles';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Show search icon
   * @default false
   */
  showSearchIcon?: boolean;
  /**
   * Input variant
   * @default 'default'
   */
  variant?: 'default' | 'search';
}

/**
 * TODO: Refactor this component to be fully modular and reusable.
 * Use Icon instead of the hardcoded search icon.
 * Implement all variants of the input component.
 * Implement all sizes of the input component.
 * Implement all states of the input component.
 * Implement all types of the input component.
 * Implement all validation of the input component.
 * Implement all helper text of the input component.
 * Implement all error text of the input component.
 * Implement all success text of the input component.
 * Implement all warning text of the input component.
 * Implement all info text of the input component.
 * Implement all disabled text of the input component.
 */

/**
 * Input component - Text input with optional search icon
 * 
 * @example
 * ```tsx
 * <Input
 *   placeholder="Search projects..."
 *   showSearchIcon
 *   variant="search"
 * />
 * ```
 */
export default function Input({
  showSearchIcon = false,
  variant = 'default',
  ...props
}: InputProps) {
  return (
    <div css={styles.inputWrapper}>
      {showSearchIcon && (
        <svg
          css={styles.searchIcon}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 12.5C10.0376 12.5 12.5 10.0376 12.5 7C12.5 3.96243 10.0376 1.5 7 1.5C3.96243 1.5 1.5 3.96243 1.5 7C1.5 10.0376 3.96243 12.5 7 12.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14.5 14.5L11 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      <input
        css={[styles.input, variant === 'search' && styles.inputSearch]}
        {...props}
      />
    </div>
  );
}

