/**
 * IconTextCell Component Styles
 * Styles for icon and text display in table cells
 */

import { css } from '@emotion/react';
import {
  borders,
  colors,
  flex,
  opacity,
  patterns,
  size,
  spacing,
  typography,
} from '../../../styleSystem';

/**
 * Container for the cell content
 */
export const container = css`
  ${flex.row}
  ${flex.centerCross}
  ${spacing.gap.s}
`;

/**
 * Icon container - size variants
 */
export const iconContainer = (iconSize: 'sm' | 'md' | 'lg') => {
  const sizeMap = {
    sm: size.height.sm,
    md: size.height.md,
    lg: size.height.lg,
  };
  
  return css`
    ${sizeMap[iconSize]}
    ${iconSize === 'sm' && size.width.sm}
    ${iconSize === 'md' && size.width.md}
    ${iconSize === 'lg' && size.width.lg}
    ${borders.radius.full}
    ${flex.center}
    flex-shrink: 0;
    overflow: hidden;
  `;
};

/**
 * Icon image
 */
export const iconImage = css`
  ${size.width.full}
  ${size.height.full}
  object-fit: cover;
`;

/**
 * Fallback circle when no icon provided
 */
export const fallbackCircle = css`
  ${size.width.full}
  ${size.height.full}
  ${borders.radius.full}
  background: ${colors.neutral.gray700};
  ${opacity.medium}
`;

/**
 * Text content container
 */
export const textContainer = css`
  ${flex.column}
  min-width: 0; /* Allow text truncation */
`;

/**
 * Primary text
 */
export const primaryText = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  color: ${colors.text.primary};
  ${patterns.truncate}
`;

/**
 * Secondary text (subtitle)
 */
export const secondaryText = css`
  ${typography.fontSize.xs}
  ${typography.lineHeight.tight}
  color: ${colors.neutral.gray600};
  ${patterns.truncate}
`;

