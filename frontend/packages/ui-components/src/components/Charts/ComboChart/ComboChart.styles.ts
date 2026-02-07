import { css } from '@emotion/react';
import {
  flex,
  spacing,
  size,
  borders,
  spacingValues,
  boxShadow,
  coloring,
  typography,
} from '../../../styleSystem';

export const chartContainer = css`
  ${flex.column}
  ${size.width.full}
  ${coloring.background.neutral.default}
  ${borders.radius.base}
`;

export const tooltip = css`
  ${coloring.background.neutral.default}
  ${borders.gray300}
  ${borders.radius.lg}
  ${spacing.padding.m}
  ${spacing.padding.x.l}
  ${boxShadow.md}
  ${size.minWidth['2xl']}
`;

export const tooltipItem = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
`;

export const tooltipDot = css`
  width: ${spacingValues.s};
  height: ${spacingValues.s};
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

export const tooltipValue = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.xs}
  ${typography.fontWeight.normal}
  ${coloring.text.primary}
`;

