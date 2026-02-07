import { css } from '@emotion/react';
import {
  flex,
  spacing,
  typography,
  borders,
  boxShadow,
  coloring,
  size,
  opacity,
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
  ${spacing.gap.s}
`;

export const titleContainer = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
`;

export const title = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.medium}
  ${typography.fontSize.base}
  ${typography.lineHeight.normal}
  ${coloring.text.primary}
`;

export const infoIcon = css`
  ${size.width.xsm}
  ${size.height.xsm}
  ${coloring.text.secondary}
  ${opacity.half}
  cursor: pointer;
  
  &:hover {
    ${coloring.text.primary}
    ${opacity.full}
  }
`;

export const subtitleContainer = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
`;

export const subtitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.normal}
  ${typography.fontSize.sm}
  ${typography.lineHeight.normal}
  ${coloring.text.secondary}
`;

export const averageBadge = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.normal}
  ${typography.fontSize.xs}
  ${typography.lineHeight.tight}
  ${coloring.text.primary}
  ${coloring.background.yellow}
  ${borders.radius['2xl']}
  ${spacing.padding.x.sm}
  ${spacing.padding.y.xs}
`;

