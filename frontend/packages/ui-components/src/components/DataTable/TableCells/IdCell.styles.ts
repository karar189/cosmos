/**
 * IdCell Component Styles
 * Styles for ID/number display in table cells
 */

import { css } from '@emotion/react';
import { colors, opacity, size, typography } from '../../../styleSystem';

/**
 * Container for ID cell
 */
export const container = css`
  ${size.width.md}
  color: ${colors.neutral.gray700};
  ${opacity.medium}
  ${typography.fontSize.sm}
`;

