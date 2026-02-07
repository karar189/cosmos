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
  ${spacing.padding.s}
  ${spacing.padding.x.m}
  ${boxShadow.md}
`;

export const tooltipValue = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.xs}
  ${typography.fontWeight.normal}
  ${coloring.text.primary}
`;

