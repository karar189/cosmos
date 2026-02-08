import { css } from '@emotion/react';
import {
  flex,
  spacing,
  size,
  coloring,
  typography,
  breakpoints,
  borders,
  spacingValues,
  colors,
} from '@core3/ui-components/styleSystem';

export const pageContainer = css`
  ${flex.column}
  ${size.width.full}
  max-width: 1600px;
  margin: 0 auto;
  ${spacing.padding.x.l}
  ${spacing.padding.y.l}
  min-height: 100vh;
  ${coloring.background.neutral.white}

  ${breakpoints.sm} {
    ${spacing.padding.x.m}
  }
`;

export const titleRow = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.m}
  ${spacing.padding.bottom.m}
`;

export const pageTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize['2xl']}
  ${typography.fontWeight.bold}
  ${coloring.text.primary}
  margin: 0;
  letter-spacing: -0.02em;
`;

export const stickyTabsContainer = css`
  /* Non-sticky so scroll doesn't get stuck; tabs scroll with content */
  ${coloring.background.neutral.white}
  border-bottom: 1px solid ${colors.neutral.gray200};
`;

export const tabsContent = css`
  ${flex.column}
  ${spacing.gap.l}
  ${spacing.padding.top.l}
`;

export const overviewSectionWrapper = css`
  ${spacing.margin.bottom.l}
`;

export const secondRowSectionWrapper = css`
  ${spacing.margin.bottom.l}
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

export const overviewGrid = css`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
  align-content: start;
  ${spacing.padding.bottom.l}

  ${breakpoints.sm} {
    grid-template-columns: 1fr;
  }
`;

export const summaryCard = css`
  grid-column: span 4;
  ${breakpoints.sm} {
    grid-column: span 1;
  }
`;

export const widgetCard = css`
  grid-column: span 4;
  ${flex.column}
  ${spacing.gap.s}
  ${spacing.padding.m}
  ${borders.radius.md}
  border: 1px solid rgba(0, 0, 0, 0.08);
  ${coloring.background.paper}
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  min-height: 100px;
  overflow: hidden;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: rgba(99, 102, 241, 0.2);
  }

  ${breakpoints.sm} {
    grid-column: span 1;
  }
`;

export const widgetCardTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${typography.fontWeight.semibold}
  ${coloring.text.primary}
  margin: 0;
  line-height: 1.3;
`;

export const widgetCardType = css`
  ${typography.fontSize.xs}
  ${coloring.text.variants.secondary.op75}
  margin: 0;
  text-transform: capitalize;
`;

export const widgetCardBody = css`
  ${flex.column}
  ${flex.justify.center}
  flex: 1;
  ${coloring.background.neutral}
  ${borders.radius.sm}
  ${spacing.padding.s}
  min-height: 48px;
`;

export const widgetPlaceholder = css`
  ${typography.fontSize.xs}
  ${coloring.text.variants.secondary.op65}
  margin: 0;
  font-style: italic;
`;

export const hiddenSection = css`
  display: none;
`;

export const notFoundContainer = css`
  ${flex.column}
  ${flex.align.center}
  ${flex.justify.center}
  ${spacing.padding.y.xxl}
  ${spacing.padding.x.l}
  min-height: 320px;
  text-align: center;
`;

export const notFoundTitle = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.xl}
  ${typography.fontWeight.semibold}
  ${coloring.text.primary}
  margin: 0 0 ${spacingValues.s} 0;
`;

export const notFoundText = css`
  ${typography.fontSize.base}
  ${coloring.text.variants.secondary.op75}
  margin: 0;
`;
