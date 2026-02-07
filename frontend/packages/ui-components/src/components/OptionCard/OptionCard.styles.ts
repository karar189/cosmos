import { css } from '@emotion/react';
import {
  borders,
  colors,
  flex,
  spacing,
  typography,
  transitions,
  cursor,
  size,
  spacingValues,
  transform,
} from '../../theme/styleSystem';

export const container = (disabled: boolean, selected: boolean) => css`
  ${flex.row};
  ${flex.align.start};
  ${spacing.gap.m};
  ${spacing.padding.m};
  background: ${colors.background.paper};
  border: ${spacingValues.xxxs} solid
    ${selected ? colors.text.primary : colors.border.tagBorder};
  ${borders.radius.xl};
  ${transitions.all};
  ${!disabled && cursor.pointer};
  user-select: none;
  opacity: ${disabled ? 0.5 : 1};
  ${size.width.custom('450px')};

  &:hover {
    ${!disabled &&
    `
      border-color: ${colors.text.primary};
    `}
  }

  &:focus-visible {
    outline: ${spacingValues.xxxs} solid ${colors.background.dark};
    outline-offset: ${spacingValues.xxxs};
  }

  &:active {
    ${!disabled &&
    `
      ${transform.scale(0.98)}
    `}
  }
`;

export const iconContainer = css`
  ${flex.center};
  color: ${colors.text.primary};
  ${flex.item.shrink0};

  svg {
    ${typography.fontSize['4xl']};
    ${size.width.custom('2.25rem')};
    ${size.height.custom('2.25rem')};
  }
`;

export const contentContainer = css`
  ${flex.column};
  ${spacing.gap.xxs};
  ${flex.one};
  ${size.minWidth.zero}
`;

export const title = css`
  ${typography.fontFamily.primary};
  ${typography.fontSize.base};
  ${typography.fontWeight.medium};
  ${typography.lineHeight.tight};
  color: ${colors.text.primary};
`;

export const description = css`
  ${typography.fontFamily.primary};
  ${typography.fontSize.sm};
  ${typography.lineHeight.normal};
  color: ${colors.text.secondary};
`;

export const actionContainer = css`
  ${flex.center};
  ${flex.item.shrink0};
  ${flex.self.center}
`;

export const radioContainer = css`
  ${flex.center};
  ${flex.item.shrink0};
  ${flex.self.start};
`;

export const arrowButton = (disabled: boolean) => css`
  ${flex.center};
  color: ${colors.text.primary};
  ${transitions.all};

  svg {
    ${typography.fontSize.base}
  }

  ${!disabled &&
  `
    &:hover {
      ${transform.scale(1.1)}
    }
  `}
`;
