/**
 * LabelBubble Component Styles
 * Pill-shaped label component for tags and categories
 */

import { css } from '@emotion/react';
import { spacing, typography } from '../../theme/styleSystem';

/**
 * Container for the label bubble
 * Pill-shaped with rounded corners and padding
 */
export const bubble = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  ${spacing.padding.y.xxs}
  ${spacing.padding.x.m}
  border-radius: 100px;
  ${typography.fontSize.xl}
  ${typography.fontWeight.medium}
  ${typography.textTransform.capitalize}
  white-space: nowrap;
  transition: transform 0.2s ease;
`;
