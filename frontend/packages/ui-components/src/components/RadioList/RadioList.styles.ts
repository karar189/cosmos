/**
 * RadioList Component Styles
 */

import { css } from '@emotion/react';
import {
  borders,
  coloring,
  colors,
  cursor,
  display,
  flex,
  position,
  size,
  spacing,
  transitions,
  typography,
} from '../../theme/styleSystem';

export const list = css`
  ${display.flex}
  ${flex.column}
  ${spacing.gap.xs}
`;

export const item = css`
  ${display.flex}
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.m}
  ${cursor.pointer}
  ${transitions.all}
  ${spacing.padding.y.xs}
  ${position.relative}
  
  &:hover {
    opacity: 0.8;
  }
`;

export const radioInput = css`
  ${position.absolute}
  ${size.width.custom('1px')}
  ${size.height.custom('1px')}
  ${spacing.padding.zero}
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

export const radioCustom = css`
  ${position.relative}
  ${display.flex}
  ${flex.center}
  ${size.width.custom('28px')}
  ${size.height.custom('28px')}
  ${borders.radius.circle}
  border: 1.5px solid ${colors.neutral.gray400};
  ${transitions.all}
  flex-shrink: 0;
  
  input:checked ~ & {
    border-color: ${colors.text.primary};
  }
  
  input:focus-visible ~ & {
    outline: 2px solid ${colors.primary.main};
    outline-offset: 2px;
  }
`;

export const radioInner = css`
  ${size.width.custom('14px')}
  ${size.height.custom('14px')}
  ${borders.radius.circle}
  ${coloring.background.dark}
`;

export const label = css`
  ${typography.fontSize.sm}
  ${coloring.text.primary}
  ${typography.fontWeight.medium}
  flex: 1;
`;

