/**
 * NumberCell Component Styles
 * Styles for numeric data display in table cells
 */

import { css } from '@emotion/react';
import {
  colors,
  flex,
  spacing,
  typography,
} from '../../../styleSystem';

/**
 * Container for the cell content
 */
export const container = css`
  ${typography.fontFamily.mono}
  ${typography.fontWeight.medium}
  ${flex.column}
`;

/**
 * Alignment styles
 */
export const alignStyles = {
  left: css`
    ${flex.align.start}
    text-align: left;
  `,
  center: css`
    ${flex.align.center}
    text-align: center;
  `,
  right: css`
    ${flex.align.end}
    text-align: right;
    ${spacing.padding.right.xl}
  `,
};

/**
 * Single value display
 */
export const singleValue = css`
  ${typography.fontSize.sm}
  color: ${colors.text.primary};
`;

/**
 * Primary value in dual mode (usually percentage or main metric)
 */
export const primaryValue = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.semibold}
  color: ${colors.text.primary};
`;

/**
 * Secondary value in dual mode (usually absolute number)
 */
export const secondaryValue = css`
  ${typography.fontWeight.bold}
  ${typography.fontSize.xs}
  color: ${colors.text.secondary};
`;
