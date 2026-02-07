/**
 * Badge Component Styles
 * Pill-shaped badge component with value and optional subValue
 */

import { css } from '@emotion/react';
import {
  borders,
  coloring,
  flex,
  overflow,
  size,
  spacing,
  typography,
  whiteSpace,
} from '../../theme/styleSystem';

export const getBadgeContainerStyles = css`
  ${borders.radius['3xl']}
  ${overflow.hidden}
  ${flex.inline}
  ${flex.align.center}
  ${flex.justify.center}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.tighter}
  ${whiteSpace.nowrap}
  ${typography.textAlign.center}
`;

const sizeStyles = {
  small: css`
    ${spacing.padding.xxs}
    ${size.minWidth.custom('34px')}
  `,
  medium: css`
    ${spacing.padding.s}
    ${size.minWidth.custom('40px')}
  `,
};

export const getValueContainerStyles = ({
  hasSubValue,
  color,
  size,
  mono,
}: {
  hasSubValue: boolean;
  color: 'red' | 'orange' | 'yellow' | 'green' | 'gray';
  size: 'small' | 'medium';
  mono: boolean;
}) => css`
  ${mono ? typography.fontFamily.mono : typography.fontFamily.primary}
  ${hasSubValue ? coloring.badge[color].backgroundSecondary : coloring.badge[color].background}
  ${sizeStyles[size]}
  ${coloring.badge[color].text}
`;

export const getSubValueContainerStyles = ({
  color,
  size,
}: {
  color: 'red' | 'orange' | 'yellow' | 'green' | 'gray';
  size: 'small' | 'medium';
}) => css`
  ${sizeStyles[size]}
  ${coloring.badge[color].background}
  ${coloring.badge[color].text}
`;
