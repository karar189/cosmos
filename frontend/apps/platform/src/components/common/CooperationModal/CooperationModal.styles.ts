import { css } from '@emotion/react';
import {
  borders,
  breakpoints,
  colors,
  flex,
  position,
  size,
  spacing,
  spacingValues,
  transitions,
} from '@core3/ui-components/styleSystem';

export const modalContainer = css`
  ${flex.center}
  ${size.minHeight.screen}
  overflow-y: auto;

  ${breakpoints.md} {
    ${spacing.padding.xl}
  }
`;

export const modalBox = css`
  position: relative;
  ${flex.column}
  background: ${colors.background.paper};
  ${borders.radius.lg}
  ${spacing.padding.y.l}
  ${spacing.padding.x.l}
  box-shadow: none;
  ${size.minHeight.full}
  ${size.width.full}
  ${size.maxWidth.lg}
  ${spacing.margin.auto}

  ${breakpoints.md} {
    ${borders.radius['2xl']}
    ${spacing.padding.y.xl}
    ${spacing.padding.x.xxl}
  }
`;

export const closeButton = css`
  ${position.absolute}
  top: ${spacingValues.xl};
  right: ${spacingValues.l};
  ${transitions.colors}

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  ${breakpoints.md} {
    top: ${spacingValues.xl};
    right: ${spacingValues.xl};
  }
`;
