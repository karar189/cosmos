import { css } from '@emotion/react';
import {
  flex,
  spacing,
  typography,
  size,
  breakpoints,
  position,
  coloring,
  overflow,
  transform,
  display,
  pointerEvents,
  shadow,
  spacingValues,
} from '../../theme/styleSystem';

export const layoutContainer = css`
  ${flex.column}
  ${size.minHeight.screen}
  ${size.height.screen}
  ${size.width.full}
  ${position.relative}
  ${coloring.background.paper}
  ${overflow.x.hidden}
  ${overflow.y.auto}
`;

export const gradientBackground = css`
  ${position.fixed}
  ${position.bottom.zero}
  ${position.left.half}
  ${transform.translate.xy('-50%', '50%')}
  width: 1500px;
  height: 1500px;
  background: radial-gradient(
    circle,
    rgba(213, 252, 146, 0.6) 0%,
    rgba(255, 249, 183, 0.8) 30%,
    rgba(255, 255, 255, 0) 70%,
    rgba(255, 255, 255, 0) 100%
  );
  ${pointerEvents.none}
  ${position.zIndex.base}
`;

export const titleSection = css`
  ${flex.column}
  ${spacing.padding.x.m}
  ${spacing.padding.y.l}
  ${position.relative}
  ${position.zIndex.dropdown}

  ${breakpoints.md} {
    ${spacing.padding.x.xxxxl}
    ${spacing.padding.y.xxxl}
  }
`;

export const titleContainer = css`
  ${flex.column}
  ${spacing.gap.custom(40)}
  ${size.width.full}
`;

export const title = css`
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

export const subtitle = css`
  ${typography.fontSize.lg}
  ${typography.lineHeight.normal}
  ${coloring.text.secondary}
  ${spacing.margin.zero}
  max-width: 800px;

  ${breakpoints.md} {
    ${typography.fontSize.xl}
  }
`;

export const mainContent = css`
  ${flex.item.grow}
  ${size.width.full}
  ${position.relative}
  ${position.zIndex.dropdown}
`;

export const mainContentWithTitle = css`
  ${coloring.background.neutral.white}
  ${shadow.none}
  border-top-left-radius: 0;
  border-top-right-radius: 0;

  ${breakpoints.md} {
    box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.05);
    border-top-left-radius: ${spacingValues['xxl']};
    border-top-right-radius: ${spacingValues['xxl']};
  }
`;
