import { css } from '@emotion/react';
import {
  flex,
  spacing,
  size,
  borders,
  typography,
  boxShadow,
  coloring,
} from '../../../styleSystem';

export const tooltip = css`
  ${coloring.background.neutral.default}
  ${borders.gray300}
  ${borders.radius.lg}
  ${spacing.padding.y.m}
  ${spacing.padding.x.m}
  ${boxShadow.md}
  ${size.minWidth['xxl']}
`;

export const tooltipDate = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.xs}
  ${typography.fontWeight.normal}
  ${coloring.text.secondary}
  ${spacing.margin.bottom.s}
  display: block;
`;

export const tooltipList = css`
  ${flex.column}
  ${spacing.gap.xxs}
`;

export const tooltipItem = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs}
  ${typography.lineHeight.tight}

`;

export const tooltipDot = css`
  ${size.width.s}
  ${size.height.s}
  ${borders.radius.full}
  flex-shrink: 0;
`;

export const tooltipLabel = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.xs}
  ${typography.fontWeight.normal}
  ${coloring.text.primary}
  flex: 1;
`;

export const tooltipBadgeWrapper = css`
  flex-shrink: 0;
  
  /* Override Badge component colors with CSS variables */
  & > div {
    background-color: var(--badge-bg, transparent) !important;
    color: var(--badge-color, inherit) !important;
    
    & > span {
      background-color: var(--badge-bg, transparent) !important;
      color: var(--badge-color, inherit) !important;
    }
  }
`;

