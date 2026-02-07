/**
 * Tag Component Styles
 */

import { css } from '@emotion/react';
import {
  typography,
  colors,
  spacingValues,
  borders,
} from '../../theme/styleSystem';

/**
 * Container for the tag component
 * Pill-shaped with border, rounded corners and padding
 */
export const tag = css`
  display: inline-flex;
  font-family: ${typography.fontFamily.primary};
  font-weight: ${typography.fontWeight.medium};
  padding: ${spacingValues.xs} ${spacingValues.sm};
  background-color: ${colors.background.paper};

  border: 1px solid ${colors.text.variants.secondary.op25};

  ${borders.radius['3xl']};

  color: ${colors.text.secondary};
  gap: ${spacingValues.sm};
  font-size: ${typography.fontSize.sm};
  line-height: ${typography.lineHeight.relaxed};

  ${typography.letterSpacing.normal};
`;
