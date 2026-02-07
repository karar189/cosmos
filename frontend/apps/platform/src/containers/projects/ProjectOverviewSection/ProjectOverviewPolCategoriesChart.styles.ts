import { flex, spacing, blur, position, size, coloring, typography, display, breakpoints } from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const headerWrapper = css`
  ${flex.column}
  ${spacing.gap.m}
  ${spacing.margin.bottom.m}
  ${flex.align.start}

  ${breakpoints.md} {
    ${flex.row}
    ${flex.align.center}
    ${flex.justify.between}
  }
`;

export const titleRow = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
`;

export const chartTitle = css`
  ${typography.fontSize.base}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
  ${spacing.margin.zero}
`;

export const exampleLabelWrapper = css`
  /* Hide Example label on mobile */
  ${display.none}

  ${breakpoints.md} {
    ${display.block}
  }
`;

export const toggleWrapper = css`
  /* Hide toggle on mobile */
  ${display.none}

  ${breakpoints.md} {
    ${display.block}
  }
`;

export const exampleLabelContainer = css`
  ${flex.row}
  ${flex.one}
  ${flex.align.center}
  ${flex.justify.between}
  ${spacing.gap.xxs}
`;

export const chartWrapper = css`
  /* Negative margin only on mobile to push chart right */
  margin-right: -30px;

  ${breakpoints.md} {
    margin-right: 0;
  }
`;
export const chartContainer = css`
  ${blur.backdrop.sm}
  ${position.relative}
`;

export const noDataOverlay = css`
  ${position.absolute}
  ${position.top.zero}
  ${position.left.zero}
  ${size.width.full}
  ${size.height.full}
  ${display.flex}
  ${flex.column}
  ${flex.align.center}
  ${flex.justify.center}
  ${blur.backdrop.lg}
`;

export const noDataText = css`
  ${typography.fontSize.base}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
`;

export const noDataText_span = css`
  ${typography.fontSize.sm}
  ${coloring.text.secondary}
`;