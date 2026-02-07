import { css } from '@emotion/react';
import { breakpoints, display, flex, pointerEvents, gradients, position, size, spacing, typography, colors, overflow } from '@core3/ui-components/styleSystem';

export const overlay = css`
  ${position.zIndex.mobileOverlay}
  ${position.absolute}
  ${position.inset.zero}
  ${size.width.full}
  ${size.height.full}
  background: ${colors.semantic.step};
  ${overflow.hidden}
  ${flex.column}
  ${flex.center}
  ${spacing.padding.l}

  ${breakpoints.lg} {
    ${display.none}
  }
`;

export const gradientOverlay = css`
  ${position.absolute}
  ${position.top.custom('-200px')}
  ${position.left.custom('-200px')}
  ${size.width.custom('800px')}
  ${size.height.custom('800px')}
  background: ${gradients.mainRadial};
  ${pointerEvents.none}
`;

export const content = css`
  ${flex.column}
  ${flex.center}
  ${spacing.gap.xxl}
  ${typography.textAlign.center}
  ${position.zIndex.above}
`;

export const title = css`
  ${typography.fontSize['3.5xl']}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.none}
  ${spacing.margin.bottom.m}
`;

export const description = css`
  ${typography.fontSize.base}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.normal}
  color: ${colors.neutral.gray650};
`;

