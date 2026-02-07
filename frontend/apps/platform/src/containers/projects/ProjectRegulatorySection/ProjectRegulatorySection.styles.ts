import { css } from '@emotion/react';
import { flex, spacing, breakpoints, display, borders, coloring, typography, colors, size } from '@core3/ui-components/styleSystem';

export const desktopLayout = css`
  ${display.none}

  ${breakpoints.lg} {
    ${display.block}
  }
`;

export const mobileLayout = css`
  ${flex.column}
  ${spacing.gap.m}
  ${spacing.padding.m}
  ${spacing.margin.top.l}
  ${borders.radius['2xl']}
  ${coloring.background.section}

  ${breakpoints.lg} {
    ${display.none}
  }
`;

export const mobileHeader = css`
  ${flex.column}
  ${spacing.gap.s}
  ${spacing.padding.left.zero}
  ${spacing.padding.right.l}
`;

export const mobileHeaderLeft = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
`;

export const mobileHeaderIcon = css`
  ${size.width.lg}
  ${size.height.lg}
  ${coloring.text.primary}
`;

export const mobileHeaderTitle = css`
  ${typography.fontSize.lg}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
  ${spacing.margin.zero}
`;

export const scoreBadge = css`
  ${spacing.padding.x.s}
  ${spacing.padding.y.xxxs}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  background-color: ${colors.yellow.background};
  color: ${colors.text.primary};
  ${borders.radius.base}
`;

export const mobileHeaderDescription = css`
  ${typography.fontSize.sm}
  ${coloring.text.secondary}
  ${spacing.margin.zero}
`;

