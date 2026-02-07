/** @jsxImportSource @emotion/react */
'use client';

import React from 'react';
import { Interpolation, Theme } from '@emotion/react';
import * as styles from './GradientBackground.styles';

export interface GradientBackgroundProps {
  /**
   * Content to render inside the gradient background
   */
  children: React.ReactNode;
  
  /**
   * Optional className for additional styling
   */
  className?: string;
  
  /**
   * Custom CSS styles using Emotion
   */
  css?: Interpolation<Theme>;
  
  /**
   * Custom CSS styles for the content wrapper
   */
  contentCss?: Interpolation<Theme>;
}

/**
 * GradientBackground Component
 * 
 * Provides a beige background with radial gradient overlay.
 * Used for special sections like Submit Data forms.
 * 
 * Features:
 * - Beige background (#FAF7DE)
 * - Radial gradient overlay
 * - Centered content with max-width constraint
 * - Rounded bottom corners (26px)
 * - Full width with responsive padding
 * 
 * @example
 * ```tsx
 * <GradientBackground>
 *   <SubmitDataCard />
 * </GradientBackground>
 * ```
 */
export default function GradientBackground({
  children,
  className,
  contentCss,
  ...props
}: GradientBackgroundProps) {
  return (
    <div css={[styles.wrapper, props.css]} className={className}>
      <div css={styles.gradientOverlay} />
      <div css={[styles.content, contentCss]}>
        {children}
      </div>
    </div>
  );
}

