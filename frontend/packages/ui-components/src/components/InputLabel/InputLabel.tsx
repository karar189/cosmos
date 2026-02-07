/** @jsxImportSource @emotion/react */
'use client';

import * as styles from './InputLabel.styles';
import { InputProps as MuiInputProps } from '@mui/material';
import { useState } from 'react';
import { Icon } from '../Icon';

export interface InputProps extends Omit<MuiInputProps, 'label' | 'error'> {
  label?: string;
  error?: string;
}

const Input = ({ label, error, type, ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setShowPassword((prev) => !prev);
    }
  };

  return (
    <div css={styles.container}>
      {label && <label css={styles.label}>{label.toUpperCase()}</label>}

      <div css={styles.inputWrapper}>
        <input
          css={styles.input}
          type={isPassword && showPassword ? 'text' : type}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />

        {isPassword && (
          <button
            type="button"
            css={styles.eyeIcon}
            onClick={handleTogglePassword}
            onKeyDown={handleKeyDown}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={0}
          >
            {showPassword ? (
              <Icon name="eye-closed" />
            ) : (
              <Icon name="eye-open" />
            )}
          </button>
        )}
      </div>

      {error && <p css={styles.error}>{error}</p>}
    </div>
  );
};

export default Input;
