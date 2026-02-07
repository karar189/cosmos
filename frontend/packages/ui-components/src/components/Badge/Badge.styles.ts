import { css } from '@emotion/react';
import {
  borders,
  coloring,
  flex,
  overflow,
  position,
  size,
  spacing,
  typography,
  whiteSpace,
} from '../../theme/styleSystem';
import type { BadgeColor, BadgeSize } from './Badge';

const sizeStyles = {
  small: css`
    ${spacing.padding.y.xxs}
    ${spacing.padding.x.s}
    ${typography.fontSize.xs}
    ${typography.lineHeight.tight}
    ${size.minWidth.custom('34px')}
  `,
  medium: css`
    ${spacing.padding.s}
    ${typography.fontSize.sm}
    ${typography.lineHeight.tight}
    ${size.minWidth.custom('40px')}
  `,
  large: css`
    ${spacing.padding.y.s}
    ${spacing.padding.x.sm}
    ${typography.fontSize.sm}
    ${typography.lineHeight.tight}
    ${size.minWidth.custom('48px')}
  `,
};
export const getBadgeContainerStyles = ({
  color,
  size,
  mono,
  weight,
}: {
  color: BadgeColor;
  size: BadgeSize;
  mono: boolean;
  weight: 'normal' | 'medium' | 'bold';
}) => {
  let colors = css`
    ${coloring.badge.component.background}
    ${coloring.badge.component.text}
  `;
  if (color === 'white') {
    colors = css`
      ${coloring.background.neutral.white}
      ${coloring.text.primary}
      ${borders.tagBorder}
    `;
  } else if (color !== 'default') {
    colors = css`
      ${coloring.badge[color].background}
      ${coloring.badge[color].text}
    `;
  }
  return css`
    ${flex.row}
    ${flex.justify.center}
    ${flex.align.center}
    ${spacing.gap.xxs}
    ${borders.radius['3xl']}
    ${typography.textAlign.center}
  ${overflow.hidden}
  ${colors}
  ${sizeStyles[size]}
  ${mono ? typography.fontFamily.mono : typography.fontFamily.primary}
  ${mono && typography.textTransform}
  ${typography.fontWeight[weight]}
  ${typography.textOverflow.ellipsis}
  ${whiteSpace.nowrap}
  `;
};

export const iconWrapper = css`
  ${flex.center}
  ${size.width.sm}
  ${size.height.sm}
  flex-shrink: 0;
`;

export const iconImage = css`
  ${size.width.sm}
  ${size.height.sm}
  ${borders.radius.full}
  ${overflow.hidden}
  ${position.relative}
`;

export const badgeContent = css`
  ${overflow.hidden}
  ${flex.one}
  ${typography.textOverflow.ellipsis}
  ${whiteSpace.nowrap}
`;
