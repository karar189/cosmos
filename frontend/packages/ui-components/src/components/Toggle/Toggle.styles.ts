import { css } from '@emotion/react';
import {
  flex,
  spacing,
  colors,
  typography,
  borders,
  transitions,
  size,
  coloring,
} from '../../styleSystem';

export const container = (sizeProp: 'small' | 'medium') => css`
  ${coloring.background.light}
  ${borders.radius.full}
  ${sizeProp === 'small' ? spacing.padding.xxxs : spacing.padding.xxs}
  ${size.width.auto}
  ${size.height.auto}
  ${flex.row}
  ${flex.base}
  ${flex.align.center}
  ${spacing.gap.zero}
`;

export const baseButton = (sizeProp: 'small' | 'medium') => css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.medium}
  ${sizeProp === 'small' ? typography.fontSize.xs : typography.fontSize.sm}
  ${typography.letterSpacing.normal}
  ${sizeProp === 'small' ? typography.lineHeight.tight : typography.lineHeight.normal}
  ${typography.textTransform.none}
  ${coloring.text.primary}
  ${size.minWidth.auto}
  ${spacing.padding.x.sm}
  ${spacing.padding.y.xxs}
  
  border-radius: 1.5rem !important;
  ${transitions.all}
  ${size.height.auto}
  ${flex.base}
  ${flex.align.center}
  ${flex.justify.center}
  ${borders.none}
  &:hover {
    background-color: transparent;
    ${coloring.text.secondary}
  }
  &:focus,
  &:focus-visible,
  &:active {
    outline: none !important;
    box-shadow: none !important;
    background-color: transparent;
  }
  &.Mui-focusVisible {
    outline: none !important;
    box-shadow: none !important;
  }
  &.Mui-selected {
    background-color: ${colors.neutral.white} !important;
    color: ${colors.text.primary} !important;
    &:hover {
      background-color: ${colors.neutral.white};
      color: ${colors.text.primary};
    }
    &:focus,
    &:focus-visible,
    &:active {
      background-color: ${colors.neutral.white};
      color: ${colors.text.primary};
    }
  }
`;

export const activeButton = css`
  background-color: ${colors.neutral.white} !important;
  color: ${colors.text.primary} !important;
  &:hover {
    background-color: ${colors.neutral.white};
    color: ${colors.text.primary};
  }
  &:focus,
  &:focus-visible,
  &:active {
    background-color: ${colors.neutral.white};
    color: ${colors.text.primary};
  }
`;
