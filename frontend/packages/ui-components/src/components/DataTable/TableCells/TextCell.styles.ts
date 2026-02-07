/**
 * TextCell Component Styles
 * Styles for text display in table cells
 */

import { css } from '@emotion/react';
import {
  colors,
  typography,
} from '../../../styleSystem';

/**
 * Base container
 */
export const container = css`
  ${typography.fontSize.sm}
  color: ${colors.text.primary};
`;

/**
 * Alignment styles
 */
export const alignStyles = {
  left: css`
    ${typography.textAlign.left};
  `,
  center: css`
    ${typography.textAlign.center};
  `,
  right: css`
    ${typography.textAlign.right};
  `,
};

/**
 * Weight styles
 */
export const weightStyles = {
  normal: css`
    ${typography.fontWeight.normal}
  `,
  medium: css`
    ${typography.fontWeight.medium}
  `,
  semibold: css`
    ${typography.fontWeight.semibold}
  `,
  bold: css`
    ${typography.fontWeight.bold}
  `,
};

