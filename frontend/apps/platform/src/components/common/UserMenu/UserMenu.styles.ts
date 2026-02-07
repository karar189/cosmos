import { css } from '@emotion/react';
import {
  flex,
  spacing,
  typography,
  colors,
  borders,
  size,
} from '@core3/ui-components/styleSystem';

export const dropdownTrigger = css`
  ${borders.all}
  border-color: ${colors.neutral.black};
  ${borders.radius.full}
  ${spacing.padding.x.m}
  ${spacing.padding.y.s}
  border-width: 2px;
`;

export const trigger = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
`;

export const iconPlaceholder = css`
  ${flex.center}
  ${size.width.xsm}
  ${size.height.xsm}
  ${flex.item.shrink0}
`;

export const icon = css`
  ${size.width.xsm}
  ${size.height.xsm}
  color: ${colors.text.secondary};
`;

export const userName = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  color: ${colors.neutral.black};
`;

export const arrow = css`
  ${size.width.md}
  ${size.height.md}
  ${flex.item.shrink0}
`;

