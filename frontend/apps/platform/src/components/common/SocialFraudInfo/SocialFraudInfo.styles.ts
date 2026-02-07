import { flex, grid, spacing, breakpoints, size } from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const socialFraudInfo = css`
  ${flex.column}
  ${spacing.gap.m}
  ${flex.align.start}
  ${size.width.full}

  ${breakpoints.lg} {
    ${grid.base}
    ${grid.cols(2)}
    ${spacing.gap.l}
  }
`;

export const websiteVisitsContainer = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
`;
