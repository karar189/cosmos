import { css } from '@emotion/react';
import {
  flex,
  spacing,
  typography,
  borders,
  boxShadow,
  opacity,
  coloring,
} from '@core3/ui-components/styleSystem';

export const chartCard = css`
  ${flex.column}
  ${coloring.background.neutral.default}
  ${borders.radius.lg}
  ${spacing.padding.l}
  ${spacing.gap.m}
  ${boxShadow.sm}
  ${spacing.margin.bottom.l}
`;

export const header = css`
  ${flex.column}
  ${spacing.gap.xs}
`;

export const title = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.medium}
  ${typography.fontSize.base}
  ${typography.lineHeight.normal}
  ${coloring.text.primary}
`;

export const subtitleContainer = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${spacing.gap.s}
`;

export const subtitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.medium}
  ${typography.fontSize.sm}
  ${typography.lineHeight.normal}
  ${coloring.text.secondary}
  ${opacity.moderate}

`;

export const rangeIndicator = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.medium}
  ${typography.fontSize.sm}
  ${typography.lineHeight.normal}
  ${coloring.text.primary}
  ${spacing.padding.right.l}
`;

