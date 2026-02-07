/**
 * CTA Button Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import {
  flex,
  spacing,
  spacingValues,
  typography,
  colors,
  borders,
  transitions,
  size,
  opacity,
  coloring,
} from '../../theme/styleSystem';

/**
 * Button wrapper with border and pill shape
 * Creates the outer border effect
 */
export const buttonWrapper = (variant: 'primary' | 'secondary' | 'inverse') => css`
  ${flex.center}
  border: 1.5px solid ${variant === 'inverse' ? colors.neutral.white : colors.neutral.gray700};
  ${borders.radius.full}
  ${spacing.padding.xxs}
  background: transparent;
`;

/**
 * Button inner content
 * Dark background with white text, uppercase styling
 */
export const buttonInner = css`
  ${flex.center}
  ${size.width.full}
  ${typography.fontFamily.mono}
  ${typography.fontSize.xs}
  ${typography.fontWeight.semibold}
  ${typography.textTransform.uppercase}
  ${typography.letterSpacing.widest}
  ${spacing.padding.y.m}
  ${spacing.padding.x.xl}
  ${borders.radius.full}
  ${transitions.all}
  line-height: 1.5;
  letter-spacing: 0;
  background-color: ${colors.text.primary};
  color: ${colors.neutral.white};
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #2a2a2a;
  }

  &:focus-visible {
    outline: 2px solid ${colors.text.primary};
    outline-offset: ${spacingValues.xxs};
  }
`;

/**
 * Inverse variant styles
 * Inverted colors - transparent background with dark text
 */
export const buttonInnerInverse = css`
  ${coloring.background.neutral.white}
  ${coloring.text.primary}

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    ${coloring.text.neutral.white}
  }
`;

/**
 * Secondary variant styles
 * Inverted colors - transparent background with dark text
 */
export const buttonInnerSecondary = css`
  background-color: transparent;
  color: ${colors.text.primary};

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

/**
 * Extra small variant styles
 */
export const buttonInnerExtraSmall = css`
  ${spacing.padding.x.m}
  ${spacing.padding.y.zero}
`;

/**
 * Small variant styles
 */
export const buttonInnerSmall = css`
  ${spacing.padding.x.m}
  ${spacing.padding.y.xs}
`;

/**
 * Extra small variant styles
 */
export const buttonWrapperExtraSmall = css`
  ${spacing.padding.xxs}
  ${borders.all}
`;

/**
 * Disabled state styles
 * Reduced opacity and disabled cursor
 */
export const buttonWrapperDisabled = css`
  ${opacity.quarter}
`;

/**
 * Full width variant
 * Expands button to take full width of container
 */
export const buttonWrapperFullWidth = css`
  ${size.width.full}
`;
