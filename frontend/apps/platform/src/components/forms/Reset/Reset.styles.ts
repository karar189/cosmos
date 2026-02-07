import { coloring, opacity, flex, spacing, typography, colors, borders, cursor, transitions, spacingValues, position, size } from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const resetContainer = css`
  ${position.relative}
`;

export const backButton = css`
  ${position.absolute}
  ${position.top.custom('0px')}
  ${position.left.custom('-40px')}
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
  ${spacing.padding.zero}
  ${borders.none}
  background: none;
  ${cursor.pointer}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.fontFamily.primary}
  color: ${colors.text.secondary};
  ${transitions.all}

  &:hover {
    color: ${colors.text.primary};
  }

  &:focus-visible {
    outline: ${spacingValues.xxxs} solid ${colors.primary.main};
    outline-offset: ${spacingValues.xxs};
    ${borders.radius.base}
  }
`;

export const backIcon = css`
  ${size.width.sm}
  ${size.height.sm}
`;

export const headerWrapper = css`
  ${spacing.padding.top.xxxl}
`;

export const resetContent = css`
  ${flex.column}
  ${spacing.gap.m};

   input::placeholder {
    ${coloring.background.transparent}
    ${opacity.moderate}
  }

  input {
    ${coloring.background.transparent}
  } 
`;

export const subtitle = css`
  ${typography.fontSize.lg};
  ${typography.fontWeight.normal};
  ${typography.fontFamily.primary};
  color: ${colors.text.secondary};
  ${typography.textAlign.center};
  ${spacing.margin.top.xs};
  ${spacing.margin.bottom.l};
  ${typography.whiteSpace.normal};
`;
