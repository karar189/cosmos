import {
  flex,
  spacing,
  typography,
  coloring,
  display,
  breakpoints,
} from '@core3/ui-components/styleSystem';
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
  margin: 0;
`;

export const exampleLabelWrapper = css`
  ${display.none}
  ${breakpoints.md} {
    ${display.block}
  }
`;

export const toggleWrapper = css`
  ${display.none}
  ${breakpoints.md} {
    ${display.block}
  }
`;

export const chartWrapper = css`
  margin-right: -30px;
  ${breakpoints.md} {
    margin-right: 0;
  }
`;

export const legendRow = css`
  ${flex.row}
  ${flex.align.center}
  flex-wrap: wrap;
  ${spacing.gap.s}
  ${spacing.margin.top.s}
  ${typography.fontSize.xs}
  ${coloring.text.secondary}
`;

export const legendItem = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs}
`;

export const legendDot = (color: string) => css`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${color};
  flex-shrink: 0;
`;
