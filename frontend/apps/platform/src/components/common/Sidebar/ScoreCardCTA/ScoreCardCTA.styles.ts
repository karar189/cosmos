import { css } from '@emotion/react';
import { borders, breakpoints, coloring, flex, size, spacing, typography } from '@core3/ui-components/styleSystem';

export const container = css`
  ${coloring.background.section}
  ${spacing.padding.y.s}
  ${spacing.padding.left.m}
  ${spacing.padding.right.s}
  ${borders.radius['4xl']}
  ${size.width.full}
  ${flex.row}
  ${flex.centerCross}
  ${flex.justify.between}
  ${spacing.gap.zero}
  
  ${breakpoints.sm} {
    ${spacing.padding.left.m}
    ${spacing.padding.right.s}
    ${flex.justify.center}
    ${spacing.gap.m}
  }
`;

export const title = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
`;

