/** @jsxImportSource @emotion/react */
'use client';

import React from 'react';
import * as styles from './Radio.styles';

type RadioSize = 'sm' | 'md';

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  size?: RadioSize;
}

export default function Radio({
  size = 'md',
  disabled: disabledProp,
  ...inputProps
}: RadioProps) {
  const isDisabled = disabledProp ?? false;

  return (
    <label css={styles.container(isDisabled)}>
      <input
        {...inputProps}
        type="radio"
        disabled={isDisabled}
        css={styles.input}
      />
      <span css={styles.control(size, isDisabled)} aria-hidden="true" />
    </label>
  );
}
