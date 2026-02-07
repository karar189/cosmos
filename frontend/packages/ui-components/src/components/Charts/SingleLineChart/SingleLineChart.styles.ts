import { css } from '@emotion/react';
import {
  flex,
  spacing,
  size,
  borders,
  typography,
  boxShadow,
  coloring,
  colors,
  spacingValues,
  sizeValues,
  position,
} from '../../../styleSystem';

export const chartContainer = css`
  ${flex.column}
  ${size.width.full}
  ${coloring.background.neutral.default}
  ${borders.radius.base}
`;

export const container = css`
  ${flex.column}
  ${size.width.full}
  border: ${spacingValues.hairline} solid ${colors.neutral.gray300};
  ${borders.radius['2xl']}
  ${spacing.padding.zero}
  ${spacing.padding.top.s}
  ${spacing.padding.left.m}
`;

export const header = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
`;

export const headerIcon = css`
  ${size.width.xsm}
  ${size.height.xsm}
`;

export const title = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
`;

export const tooltipIcon = css`
  ${size.width.sm}
  ${size.height.sm}
  ${coloring.text.secondary}
`;

export const chartContent = css`
  ${flex.column}
  ${size.width.full}
  ${spacing.padding.zero}
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

export const chartWrapper = css`
  ${position.relative}
`;

export const blurOverlay = css`
  ${size.width.custom(`calc(100% + (${sizeValues.sm} * 2))`)}
  ${size.height.custom(`calc(100% + (${sizeValues.sm} * 2))`)}
  ${position.left.custom(`-${sizeValues.sm}`)}
  ${position.top.custom(`-${sizeValues.sm}`)}
`;

