import {
  breakpoints,
  coloring,
  display,
  grid,
  position,
  spacing,
  typography,
} from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const container = css`
  ${position.relative}
  ${spacing.padding.y.m}
  ${spacing.padding.x.m}
  
  ${breakpoints.md} {
    ${spacing.padding.y.l}
    ${spacing.padding.x.xxxxl}
  }
  
  ${breakpoints.xxxl} {
    /* ${spacing.padding.x.zero} */
  }
`;

export const contentWrapper = css`
  width: 100%;
  margin: 0 auto;
`;

export const pageTitle = css`
  ${typography.fontSize['4xl']}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.tighter}
  ${coloring.text.primary}
  ${spacing.margin.zero}
  ${typography.textTransform.uppercase}
  
  ${breakpoints.md} {
    ${typography.fontSize['5xl']}
    ${spacing.margin.bottom.l}
  }

  strong {
    ${typography.fontWeight.bold}
    ${display.block}
  }
`;

export const listWrapper = css`
  ${grid.base}
  ${grid.rows(1)}
  ${grid.cols(1)}
  ${spacing.gap.s}
  
  ${breakpoints.md} {
    ${grid.cols(4)}
    ${spacing.gap.m}
  }
`;
