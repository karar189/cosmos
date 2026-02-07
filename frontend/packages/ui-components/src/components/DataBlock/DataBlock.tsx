/** @jsxImportSource @emotion/react */
'use client';

import { Interpolation, Theme } from '@emotion/react';
import React from 'react';
import * as styles from './DataBlock.styles';

export interface DataBlockProps {
  /**
   * Title of the data block
   */
  title: string;
  /**
   * Subtitle/description of the data block
   */
  subtitle: string;
  /**
   * Content to be displayed in the data block
   */
  children?: React.ReactNode;
  /**
   * Custom CSS for the container
   */
  css?: Interpolation<Theme>;
  /**
   * Custom CSS for the title
   */
  titleCss?: Interpolation<Theme>;
  /**
   * Custom CSS for the subtitle
   */
  subtitleCss?: Interpolation<Theme>;
  /**
   * Custom CSS for the content area
   */
  contentCss?: Interpolation<Theme>;
}

/**
 * DataBlock component - A card-like component with title, subtitle, and content area
 * 
 * Used for displaying structured data blocks in the workspace and other areas.
 * 
 * @example
 * ```tsx
 * <DataBlock
 *   title="Custom Scoring"
 *   subtitle="Select only the metrics that matter for your regulatory framework"
 * >
 *   <YourContent />
 * </DataBlock>
 * ```
 */
export default function DataBlock({
  title,
  subtitle,
  children,
  css,
  titleCss,
  subtitleCss,
  contentCss,
  ...props
}: DataBlockProps) {
  return (
    <div css={[styles.dataBlockContainer, css]} {...props}>
      <div css={styles.dataBlockHeader}>
        <h3 css={[styles.dataBlockTitle, titleCss]}>{title}</h3>
        <p css={[styles.dataBlockSubtitle, subtitleCss]}>{subtitle}</p>
      </div>
      <div css={[styles.dataBlockContent, contentCss]}>
        {children}
      </div>
    </div>
  );
}

