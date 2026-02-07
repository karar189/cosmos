import { css } from '@emotion/react';
import {
  flex,
  spacing,
  typography,
  colors,
  borders,
  position,
  coloring,
  cursor,
  transitions,
  size,
  breakpoints,
  display,
} from '@core3/ui-components/styleSystem';

export const searchButton = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${position.relative}
  ${spacing.padding.x.m}
  ${spacing.padding.y.xs}
  ${typography.fontFamily.primary}
  ${typography.fontSize.sm}
  ${borders.radius.full}
  border: 2px solid ${colors.text.primary};
  ${coloring.background.transparent}
  ${coloring.text.primary}
  ${size.width['5xl']}
  ${transitions.all}
  ${cursor.pointer}

  &:hover {
    background-color: ${colors.background.hover};
  }

  &:focus {
    background-color: ${colors.background.hover};
  }
`;

export const searchIconLeft = css`
  color: ${colors.text.secondary};
  ${size.width.md}
  ${size.height.md}
`;

export const searchText = css`
  color: ${colors.text.secondary};
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
`;

export const slashKey = css`
  ${flex.center}
  color: ${colors.neutral.black};
  ${borders.radius.md}
  ${spacing.padding.y.xxs}
  ${spacing.padding.x.xs}
  ${typography.fontSize.xs}
  ${typography.fontWeight.semibold}
  ${typography.lineHeight.tight}
  ${size.width.md}
  ${size.height.md}
  ${typography.fontFamily.mono}
  background-color: ${colors.star.unfilled};
  ${display.none}

  ${breakpoints.md} {
    ${display.block}
  }
`;

