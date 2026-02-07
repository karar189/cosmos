import {
  borders,
  coloring,
  flex,
  gradients,
  overflow,
  position,
  size,
  spacing,
  typography,
  breakpoints,
  display,
} from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const sectionWrapper = (isExpanded: boolean) => css`
  ${position.relative}
  ${!isExpanded && spacing.padding.bottom.custom('72px')}
  ${borders.radius['2xl']}
  ${overflow.hidden}
  transition: padding-bottom 0.4s ease-in-out;
`;

export const comingSoonOverlay = css`
  ${position.absolute}
  ${position.bottom.zero}
  ${position.left.zero}
  ${position.right.zero}
  ${flex.column}
  ${flex.center}
  ${flex.justify.end}
  ${spacing.padding.x.m}
  ${spacing.padding.y.custom('40px')}
  background: ${gradients.comingSoonOverlay};
  ${position.zIndex.dropdown}
  ${flex.column}
  ${flex.center}
  ${spacing.gap.s}
  ${typography.textAlign.center}
`;

export const comingSoonTitle = css`
  ${typography.fontSize.xl}
  ${typography.fontWeight.medium}
`;

export const comingSoonSubtitle = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.secondary}
`;

export const buttonIcon = (isExpanded: boolean) => css`
  ${size.width.sm}
  ${size.height.sm}
  ${spacing.margin.left.xs}
  transform: rotate(${isExpanded ? '180deg' : '0deg'});
  transition: transform 0.3s ease-in-out;
`;

export const comingSoonButton = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${spacing.padding.y.s}
  ${spacing.padding.x.m}
`;

export const hideMetricsWrapper = css`
  grid-column: 1 / -1;
  ${flex.row}
  ${flex.justify.center}
  ${spacing.padding.y.l}
`;

export const card = css`
  ${size.height.full}
`;

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

export const comingSoonBadge = css`
  /* Coming soon badge in header */
`;

export const mobileCardsWrapper = (isExpanded: boolean) => css`
  ${position.relative}
  ${flex.column}
  ${spacing.gap.m}
  ${!isExpanded && spacing.padding.bottom.custom('100px')}
  ${borders.radius['2xl']}
  ${overflow.hidden}
`;

export const mobileComingSoonOverlay = css`
  ${position.absolute}
  ${position.bottom.zero}
  ${position.left.zero}
  ${position.right.zero}
  ${flex.column}
  ${flex.center}
  ${flex.justify.end}
  ${spacing.padding.x.m}
  ${spacing.padding.top.custom('90px')}
  ${spacing.padding.bottom.custom('10px')}
  background: ${gradients.comingSoonOverlay};
  ${position.zIndex.dropdown}
  ${flex.column}
  ${flex.center}
  ${spacing.gap.s}
  ${typography.textAlign.center}
`;

export const mobileButtonWrapper = css`
  ${flex.row}
  ${flex.justify.center}
  ${spacing.padding.y.m}
`;
