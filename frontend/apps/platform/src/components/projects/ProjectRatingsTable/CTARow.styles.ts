/**
 * CTARow Component Styles
 * Styles for the call-to-action row
 */

import { css } from '@emotion/react';
import { borders, colors, flex, size, spacing, typography } from '@core3/ui-components/styleSystem';

/**
 * CTA Cell (spans all columns)
 */
export const ctaCell = css`
  background: ${colors.star.unfilled};
  ${borders.radius['3xl']}
`;

/**
 * CTA Cell Inner (flexbox container)
 */
export const ctaCellInner = css`
  ${flex.center}
  ${spacing.gap.l}
  ${spacing.padding.y.xs}
  ${size.width.full}
`;

/**
 * CTA Title
 */
export const ctaTitle = css`
  ${typography.fontSize.base}
  ${typography.fontWeight.medium}
  color: ${colors.text.primary};
`;

