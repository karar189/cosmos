import {
  coloring,
  flex,
  size,
  spacing,
  transform,
  transitions,
  typography,
} from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const valueBlock = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.l}
`;

export const deltaBlock = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xxs}
`;

export const deltaIcon = (isPositive: boolean) => css`
  ${size.width.xxs}
  ${size.height.xxs}
  ${isPositive ? coloring.text.error : coloring.text.success}
  ${isPositive ? transform.rotate(180) : transform.rotate(0)}
  ${transitions.transform}
`;

export const deltaValue = css`
  ${coloring.text.secondary}
  ${typography.fontFamily.mono}
  ${typography.fontWeight.medium}
  ${typography.fontSize.sm}
`;
