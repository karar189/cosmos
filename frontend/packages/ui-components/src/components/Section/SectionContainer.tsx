/** @jsxImportSource @emotion/react */
'use client';

import { Interpolation, Theme } from '@emotion/react';
import React from 'react';
import * as styles from './SectionContainer.styles';
export interface SectionContainerProps {
  children?: React.ReactNode;
  id?: string;
  css?: Interpolation<Theme>;
  style?: React.CSSProperties;
}

/**
 * SectionContainer component - Basic container wrapper for section content
 * This is a secondary component for cases where you need just the styled wrapper
 * without the default SectionHeader and SectionGrid structure.
 */
export default function SectionContainer({ children, ...props }: SectionContainerProps) {
  return (
    <section css={styles.sectionContainer} {...props}>
      {children}
    </section>
  );
}
