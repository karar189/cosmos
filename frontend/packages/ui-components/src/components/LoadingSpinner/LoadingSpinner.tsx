/** @jsxImportSource @emotion/react */
'use client';

import { CircularProgress } from '@mui/material';
import * as styles from './LoadingSpinner.styles';
import { SerializedStyles } from '@emotion/react';

export interface LoadingSpinnerProps {
  /**
   * Size of the loading spinner
   * @default 40
   */
  size?: number | string;
  /**
   * Additional CSS styles to apply
   */
  css?: SerializedStyles | SerializedStyles[];
  /**
   * Additional CSS class name
   */
  className?: string;
}

export default function LoadingSpinner({ size = 40, css, className }: LoadingSpinnerProps) {
  return (
    <CircularProgress
      size={size}
      css={css ? [styles.loadingSpinner, css] : styles.loadingSpinner}
      className={className}
      aria-label="Loading"
    />
  );
}