import { css } from '@emotion/react';
import {
  patterns,
  typography,
  coloring,
  transitions,
  borders,
  flex,
  spacing,
  colors,
  size,
} from '../../theme/styleSystem';

export const trigger = css`
  ${patterns.resetButton}
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xxs}
  ${spacing.padding.x.sm}
  ${spacing.padding.y.s}
  ${typography.fontSize.sm}
  ${typography.fontWeight.semibold}
  ${typography.fontFamily.mono}
  ${typography.textTransform.uppercase}
  ${typography.letterSpacing.wide}
  ${coloring.text.primary}
  ${coloring.background.transparent}
  ${borders.none}
  ${transitions.colors}
  cursor: pointer;

  &:hover {
    ${typography.fontWeight.bold}
  }

  &:focus-visible {
    outline: 2px solid ${colors.text.primary};
    outline-offset: 2px;
    ${borders.radius.sm}
  }
`;

export const menuStyles = css`
  .MuiPaper-root {
    ${spacing.margin.top.xs}
    ${coloring.background.paper}
    ${borders.all}
    border-color: ${colors.neutral.black};
    ${borders.radius.base}
    box-shadow: none;
    ${size.minWidth.lg}
  }

  .MuiList-root {
    ${spacing.padding.zero}
  }
`;

export const menuItem = css`
  ${spacing.padding.x.m}
  ${spacing.padding.y.s}
  ${transitions.colors}

  &:hover {
    background-color: ${colors.neutral.black};
    color: ${colors.neutral.white};
    
    a, span {
      color: ${colors.neutral.white};
    }
  }
`;

export const menuLink = css`
  ${typography.textDecoration.none}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
  ${size.width.full}
  display: block;
`;

export const menuText = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
`;

export const divider = css`
  ${spacing.margin.y.xs}
  border-color: ${colors.neutral.gray200};
`;

