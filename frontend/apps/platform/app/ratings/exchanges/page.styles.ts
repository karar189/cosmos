import {
  blur,
  breakpoints,
  coloring,
  display,
  flex,
  gradients,
  grid,
  pointerEvents,
  position,
  size,
  spacing,
  typography,
  userSelect,
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
  ${size.width.full}
  ${spacing.margin.y.zero}
  ${spacing.margin.x.auto}
`;

export const pageTitle = css`
  ${typography.fontSize['5xl']}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.tighter}
  ${coloring.text.primary}
  ${spacing.margin.zero}
  ${typography.textTransform.uppercase}

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

export const comingSoonCardWrapper = css`
  ${position.relative}
  ${size.width.full}
  ${size.height.full}
`;

export const comingSoonOverlay = css`
  ${position.absolute}
  ${position.bottom.custom('-20px')}
  ${position.left.custom('-20px')}
  ${position.right.custom('-20px')}
  ${flex.column}
  ${flex.center}
  ${flex.justify.center}
  ${spacing.padding.x.m}
  ${spacing.padding.y.l}
  ${size.height.custom('100px')}
  background: ${gradients.comingSoonOverlay};
  ${position.zIndex.dropdown}
  ${spacing.gap.s}
  ${typography.textAlign.center}
`;

export const comingSoonText = css`
  ${typography.fontSize.base}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
`;

export const comingSoonSubtitle = css`
  ${typography.fontSize.xs}
  ${typography.fontWeight.medium}
  ${coloring.text.secondary}
`;

export const blurredContent = css`
  ${blur.value.custom('4px')}
  ${pointerEvents.none}
  ${userSelect.none}
`;
