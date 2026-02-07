/**
 * DataBlock Component Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import {
  flex,
  spacing,
  borders,
  coloring,
  typography,
  size,
  boxShadow,
} from '../../theme/styleSystem';

/**
 * Main data block container
 */
export const dataBlockContainer = css`
  ${flex.column}
  ${spacing.gap.sm}
  ${spacing.padding.m}
  ${borders.radius.xl}
  ${size.maxWidth.custom('360px')}
  ${size.height.custom('296px')}
  ${borders.dataBlock}
  ${boxShadow.xs}
`;

/**
 * Data block header (title + subtitle)
 */
export const dataBlockHeader = css`
  ${flex.column}
  ${flex.align.center}
  ${spacing.gap.xxs}
`;

/**
 * Data block title
 */
export const dataBlockTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.base}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.normal}
  ${coloring.text.primary}
  ${spacing.margin.zero}
  ${typography.textAlign.center}
`;

/**
 * Data block subtitle
 */
export const dataBlockSubtitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.tight}
  ${coloring.text.variants.secondary.op50}
  ${spacing.margin.zero}
  ${typography.textAlign.center}
`;

/**
 * Data block content area
 */
export const dataBlockContent = css`
  ${flex.column}
  ${spacing.gap.sm}
  ${spacing.padding.m}
  ${borders.radius.lg}
  ${coloring.background.light}
  ${size.width.full}
  ${flex.item.grow}
`;

