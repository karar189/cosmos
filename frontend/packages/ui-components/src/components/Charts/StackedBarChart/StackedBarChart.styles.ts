import { css } from '@emotion/react';
import {
  flex,
  spacing,
  borders,
  typography,
  boxShadow,
  coloring,
  size
} from '../../../styleSystem';

export const chartContainer = css`
  ${flex.column}
  ${size.width.full}
  position: relative;
`;

export const tooltip = css`
  ${coloring.background.neutral.default}
  ${borders.gray300}
  ${borders.radius.lg}
  ${spacing.padding.m}
  ${boxShadow.md}
`;

export const positiveBarContainerStyle = css`
  ${size.width.full}
  ${size.height.full}
  ${coloring.background.neutral.default}
  ${borders.radius.full}
  ${spacing.margin.bottom.xl}
`;
export const tooltipLabel = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.bold}
  ${typography.fontSize.sm}
  ${coloring.text.primary}
  ${spacing.margin.bottom.xs}
`;

export const tooltipItem = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
  ${spacing.margin.bottom.xxs}
`;

export const tooltipDot = css`
  ${size.width.s}
  ${size.height.s}
  ${borders.radius.full}
`;

export const tooltipText = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.xs}
  ${coloring.text.secondary}
  flex: 1;
`;

export const tooltipValue = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.semibold}
  ${typography.fontSize.xs}
  ${coloring.text.primary}
`;

