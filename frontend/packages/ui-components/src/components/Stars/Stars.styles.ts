/**
 * Stars Component Styles
 * Rating component with filled and unfilled stars
 */

import { css } from '@emotion/react';
import { colors, flex, spacing, transitions } from '../../theme/styleSystem';

export const container = css`
  ${flex.row}
  ${spacing.gap.xs}
  min-width: 100px;
`;

export const getStarStyles = (isFilled: boolean) => css`
  ${transitions.colors}
  color: ${isFilled ? colors.star.filled : colors.star.unfilled};
`;
