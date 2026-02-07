import {
  background,
  borders,
  breakpoints,
  coloring,
  colors,
  flex,
  position,
  spacing,
  spacingValues,
  typography,
} from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const stickyTabsContainer = css`
  ${position.sticky}
  top: calc(${spacingValues.xxxxl} + ${spacingValues.xxl}); // 96px + 48px = 144px (approximate header height)
  ${position.zIndex.sticky}
  ${background.project}
  border-bottom: 1px solid ${colors.neutral.gray200};
`;

export const tabsContent = css`
  ${flex.column}
  ${spacing.gap.m}
  ${spacing.padding.x.l}
`;

export const improveScoreContainer = css`
  ${spacing.margin.x.m}
  ${flex.row}
  ${spacing.gap.xs}
  ${flex.justify.between}
  ${flex.align.center}
  ${coloring.background.dark}

  ${spacing.padding.y.s}
  ${spacing.padding.left.m}
  ${spacing.padding.right.s}
  ${borders.radius['4xl']}

  ${breakpoints.sm} {
    ${spacing.padding.left.m}
    ${spacing.padding.right.s}
    ${flex.justify.center}
    ${spacing.gap.m}
  }
`;

export const improveScoreText = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.neutral.white}

  ${breakpoints.sm} {
    ${typography.fontSize.base}
  }
`;

export const improveScoreButton = css``;

export const hiddenSection = css`
  display: none;
`;
