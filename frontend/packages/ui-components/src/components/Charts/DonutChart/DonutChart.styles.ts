import { css } from '@emotion/react';
import {
  flex,
  spacing,
  borders,
  boxShadow,
  coloring,
  typography,
  size,
} from '../../../styleSystem';

export const chartContainer = css`
  ${flex.column}
  position: relative;
`;

export const tooltip = css`
  ${coloring.background.neutral.default}
  ${borders.gray300}
  ${borders.radius.lg}
  ${spacing.padding.m}
  ${spacing.padding.x.l}
  ${boxShadow.md}
  ${size.minWidth.custom('120px')}
`;

export const tooltipItem = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
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

export const tooltipValue = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.xs}
  ${typography.fontWeight.normal}
  ${coloring.text.primary}
`;

