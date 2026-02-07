import { css } from '@emotion/react';
import {
  borders,
  coloring,
  cursor,
  display,
  flex,
  opacity,
  overflow,
  position,
  shadows,
  size,
  spacing,
  spacingValues,
  transitions,
  typography,
  whiteSpace,
} from '@core3/ui-components/styleSystem';
import type { BadgeColor, BadgeSize } from '../Badge';

export const button = css`
  ${coloring.background.transparent}
  ${borders.none}
    ${spacing.padding.zero}
    ${cursor.pointer};
`;

export const dropdownContainer = css`
  ${position.relative}
  ${display.inlineBlock}
`;

const sizeStyles = {
  small: css`
    ${spacing.padding.xxs}
    ${size.minWidth.custom('34px')}
    ${spacing.gap.xxs}
  `,
  medium: css`
    ${spacing.padding.s}
    ${size.minWidth.custom('40px')}
    ${spacing.gap.xxs}
  `,
  large: css`
    ${spacing.padding.y.s}
    ${spacing.padding.x.sm}
    ${size.minWidth.custom('48px')}
    ${spacing.gap.xxs}
  `,
};

export const getBadgeSelectStyles = ({
  color,
  size: badgeSize,
}: {
  color: BadgeColor;
  size: BadgeSize;
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
    ${borders.radius['3xl']}
    ${colors}
  ${typography.fontFamily.mono}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.tighter}
  ${whiteSpace.nowrap}
  ${typography.textAlign.center}
  ${typography.textTransform.uppercase}
  ${flex.center}
  ${sizeStyles[badgeSize]}
  ${borders.none}
  ${cursor.pointer};
    transition: opacity 0.2s;
    outline: none;

    &:active {
      ${opacity.medium}
    }
  `;
};

export const badgeSelectOpen = css`
  ${opacity.high}
`;

export const getDropdownMenuStyles = ({ color }: { color: BadgeColor }) => {
  let colors = css`
    ${coloring.badge.component.background}
  `;
  if (color === 'white') {
    colors = css`
      ${coloring.background.neutral.white}
    `;
  } else if (color !== 'default') {
    colors = css`
      ${coloring.badge[color].background}
    `;
  }
  return css`
    ${position.absolute}
    ${borders.radius.xl}
  ${colors}
  ${spacing.padding.xxs}
  ${spacing.gap.xxs}
  ${overflow.hidden}
  ${opacity.full}
  top: calc(100% + ${spacingValues.xxs});
    ${position.right.zero}
    ${size.minWidth.full};
    ${display.flex}
    ${flex.column}
  ${shadows.s}
  ${position.zIndex.dropdown};
  `;
};

export const getDropdownItemStyles = ({ color }: { color: BadgeColor }) => {
  let colors = css`
    ${coloring.badge.component.text}
  `;
  if (color === 'white') {
    colors = css`
      ${coloring.text.primary}
    `;
  } else if (color !== 'default') {
    colors = css`
      ${coloring.badge[color].text}
    `;
  }
  return css`
    ${borders.radius.lg}
    ${colors}
  ${typography.fontFamily.mono}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.tighter}
  ${whiteSpace.nowrap}
  ${typography.textAlign.center}
  ${typography.textTransform.uppercase}
  ${spacing.padding.xs}
  ${coloring.background.transparent}
  ${borders.none}
  ${cursor.pointer};
    ${transitions.background}
    outline: none;
  `;
};
export const dropdownItemActive = css`
  ${typography.fontWeight.bold}
`;
