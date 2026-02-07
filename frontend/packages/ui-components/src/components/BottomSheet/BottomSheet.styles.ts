/**
 * BottomSheet Component Styles
 */

import { css } from '@emotion/react';
import {
  borders,
  coloring,
  colors,
  cursor,
  display,
  flex,
  patterns,
  position,
  size,
  sizeValues,
  spacing,
  spacingValues,
  transitions,
  typography,
} from '../../theme/styleSystem';

export const modalContainer = css`
  ${display.flex}
  ${flex.align.end}
  ${flex.justify.center}
`;

export const backdrop = css`
  ${position.fixed}
  ${position.inset.zero}
  background-color: ${colors.backdrop.modal};
  ${cursor.pointer}
`;

export const sheetContainer = css`
  ${position.fixed}
  ${position.bottom.zero}
  ${position.left.zero}
  ${position.right.zero}
  ${display.flex}
  ${flex.justify.center}
  ${flex.align.end}
  pointer-events: none;
`;

export const sheet = css`
  ${size.width.full}
  ${size.maxWidth.custom('600px')}
  background-color: ${colors.neutral.white};
  border-top-left-radius: ${spacingValues.l};
  border-top-right-radius: ${spacingValues.l};
  ${size.maxHeight.custom('50vh')}
  ${display.flex}
  ${flex.column}
  pointer-events: auto;
`;

export const header = css`
  ${display.flex}
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${spacing.padding.x.l}
  ${spacing.padding.top.sm}
  ${spacing.padding.bottom.s}
`;

export const title = css`
  ${typography.fontSize['xl']}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
  ${spacing.margin.zero}
`;

export const closeButton = css`
  ${patterns.resetButton}
  ${size.width.custom('40px')}
  ${size.height.custom('40px')}
  ${display.flex}
  ${flex.center}
  ${borders.radius.circle}
  ${cursor.pointer}
  ${transitions.all}
  
  svg {
    width: ${sizeValues.md};
    height: ${sizeValues.md};
    color: ${colors.neutral.gray600};
  }
  
  &:hover {
    background-color: ${colors.background.hover};
  }
  
  &:focus-visible {
    outline: 2px solid ${colors.primary.main};
    outline-offset: 2px;
  }
`;

export const content = css`
  ${flex.item.grow}
  ${display.flex}
  ${flex.column}
  min-height: 0;
  ${spacing.padding.x.l}
  ${spacing.padding.bottom.zero}
  ${spacing.padding.top.zero}
`;

