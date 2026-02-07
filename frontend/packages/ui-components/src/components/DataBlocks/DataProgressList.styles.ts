/**
 * DataProgressList Component Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import { flex, spacing, size } from '../../theme/styleSystem';

/**
 * Data progress list container
 */
export const dataProgressList = css`
  ${flex.column}
  ${spacing.gap.s}
  ${size.width.full}
`;

