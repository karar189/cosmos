/** @jsxImportSource @emotion/react */
'use client';

import { Interpolation, Theme } from '@emotion/react';
import React, { forwardRef } from 'react';
import * as styles from './DataText.styles';

export interface DataTextProps {
  children: React.ReactNode;
  label?: string;
  positive?: boolean;
  negative?: boolean;
  disabled?: boolean;
  css?: Interpolation<Theme>;
  containerCss?: Interpolation<Theme>;
  mono?: boolean;
}

const DataText = forwardRef<HTMLDivElement, DataTextProps>(
  (
    { children, label, positive = false, negative = false, disabled = false, containerCss, mono = false, ...props },
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <div css={styles.dataText({ positive, negative, disabled, mono })} {...props} ref={ref}>
        {label && <span css={styles.dataTextLabel}>{label}</span>}
        <div css={[styles.dataTextContent, containerCss]}>{children}</div>
      </div>
    );
  }
);

DataText.displayName = 'DataText';

export default DataText;
