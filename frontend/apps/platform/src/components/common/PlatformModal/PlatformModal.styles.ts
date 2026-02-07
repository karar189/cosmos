import { css } from '@emotion/react';
import {
  borders,
  breakpoints,
  flex,
  coloring,
  outline,
  overflow,
  position,
  shadow,
  size,
  spacing,
} from '@core3/ui-components/styleSystem';

export const modalContainer = css`
  ${flex.center}
  ${size.minHeight.screen}
  ${overflow.y.auto}

  ${breakpoints.md} {
    ${spacing.padding.xl}
  }
`;

export const modalBox = css`
  ${position.relative}
  ${flex.column}
  ${coloring.background.paper}
  ${borders.radius.lg}
  ${shadow.none}
  ${outline.none}
  ${size.minHeight.full}
  ${size.width.full}
  ${size.maxWidth.lg}
  ${spacing.margin.auto}
  
  /* Mobile: Extra top padding for close button, normal side/bottom padding */
  ${spacing.padding.top.xxxxl}
  ${spacing.padding.bottom.l}
  ${spacing.padding.x.l}

  ${breakpoints.md} {
    ${borders.radius['2xl']}
    ${spacing.padding.y.xl}
    ${spacing.padding.x.xxl}
  }
`;

