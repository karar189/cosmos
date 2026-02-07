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
  sizeValues,
  spacing,
  spacingValues,
  transitions,
  typography,
} from '../../theme/styleSystem';

export const list = css`
  ${display.flex}
  ${flex.column}
`;

export const item = css`
  ${display.flex}
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.m}
  ${cursor.pointer}
  ${transitions.all}
  ${spacing.padding.y.s}
  ${position.relative}
  
  &:hover {
    opacity: 0.8;
  }
`;

export const checkboxInput = css`
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

export const checkboxCustom = css`
  ${position.relative}
  ${display.flex}
  ${flex.center}
  ${size.width.md}
  ${size.height.md}
  ${borders.radius.md}
  border: ${spacingValues.hairline} solid ${colors.neutral.gray300};
  background-color: ${colors.neutral.white};
  ${transitions.all}
  flex-shrink: 0;
  
  input:checked ~ & {
    background-color: ${colors.text.primary};
    border-color: ${colors.text.primary};
  }
  
  input:focus-visible ~ & {
    outline: ${spacingValues.xxxs} solid ${colors.primary.main};
    outline-offset: ${spacingValues.xxxs};
  }
  
  svg {
    width: ${sizeValues.sm};
    height: ${sizeValues.sm};
    color: ${colors.neutral.white};
    opacity: 0;
    ${transitions.all}
  }
  
  input:checked ~ & svg {
    opacity: 1;
  }
`;

export const label = css`
  ${typography.fontSize.sm}
  ${coloring.text.primary}
  ${typography.fontWeight.medium}
  flex: 1;
`;

export const count = css`
  ${typography.fontSize.sm}
  ${coloring.text.secondary}
  ${typography.fontWeight.normal}
  ${spacing.padding.right.m}
`;

