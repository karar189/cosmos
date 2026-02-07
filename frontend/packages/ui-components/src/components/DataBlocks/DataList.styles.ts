/**
 * DataList Component Styles
 * Uses the standardized style system for consistent, maintainable styling
 */

import { css } from '@emotion/react';
import { flex, spacing, size } from '../../theme/styleSystem';

/**
 * Data list container
 */
export const dataList = ({ horizontal }: { horizontal: boolean }) => css`
  ${horizontal ? flex.row : flex.column}
  ${spacing.gap.s}
  ${size.width.full}
`;
