import { css } from '@emotion/react';
import {
  flex,
  spacing,
  typography,
  colors,
  overflow,
  size,
} from '@core3/ui-components/styleSystem';

export const container = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
`;

export const iconContainer = css`
  ${flex.center}
  ${size.width.custom('34px')}
  ${size.height.custom('34px')}
  ${flex.item.shrink0}
`;

export const icon = css`
  ${size.width.custom('34px')}
  ${size.height.custom('34px')}
  color: ${colors.text.secondary};
`;

export const textContainer = css`
  ${flex.column}
  ${spacing.gap.xxxs}
  ${flex.item.shrink0}
`;

export const accountTypeLabel = css`
  ${typography.fontSize.xs}
  ${typography.fontWeight.medium}
  color: ${colors.text.secondary};
  ${overflow.hidden}
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const organizationName = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  color: ${colors.neutral.black};
  ${overflow.hidden}
  text-overflow: ellipsis;
  white-space: nowrap;
`;

