import {
  borders,
  coloring,
  flex,
  size,
  spacing,
  typography,
  breakpoints,
  display,
} from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const prosConsCard = css`
  ${flex.row}
  ${spacing.gap.l}
`;

export const prosConsCardItem = css`
  ${flex.one}
`;

export const prosConsListContainer = css`
  ${flex.row}
  ${spacing.gap.l}
`;

export const prosConsList = css`
  ${flex.one}
`;

export const prosConsListTitle = css`
  ${typography.fontWeight.medium}
  ${spacing.margin.bottom.m}
`;

export const legendIcon = (props: { positive: boolean }) => css`
  ${size.width.sm}
  ${size.height.sm}
  ${borders.radius.full}
  ${props.positive ? coloring.status.green : coloring.status.red}
`;

export const legendContainer = css`
  ${flex.row}
  ${spacing.gap.m}
  ${spacing.margin.top.sm}
`;

export const legendItem = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs}
  ${typography.fontSize.xs}
`;

export const exampleLabelContainer = css`
  ${flex.row}
  ${flex.one}
  ${flex.align.center}
  ${flex.justify.between}
  ${spacing.gap.xxs}
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

export const mobileToggleWrapper = css`
  ${flex.row}
  ${flex.justify.start}
  ${spacing.margin.bottom.m}
`;

export const chartWrapper = css`
  /* Negative margin only on mobile to extend chart to right edge */
  margin-right: -20px;

  ${breakpoints.lg} {
    ${spacing.margin.right.zero}
  }
`;