import { css } from '@emotion/react';
import { coloring, colors, flex, position, size, spacing, typography } from '@core3/ui-components/styleSystem';

export const container = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.center}
  ${spacing.gap.s}
`;

export const donutWrapper = css`
  ${position.relative}
  ${size.width.custom('40px')}
  ${size.height.custom('40px')}
  ${flex.base}
  ${flex.align.center}
  ${flex.justify.center}
`;

export const donutSvg = css`
  ${position.absolute}
  ${position.top.zero}
  ${position.left.zero}
`;

export const percentageText = css`
  ${position.relative}
  ${typography.fontFamily.mono}
  ${typography.fontSize.xs}
  ${typography.fontWeight.medium}
  ${typography.textAlign.center}
  color: ${colors.text.primary}
  z-index: 1;
`;

export const labelSection = css`
  ${position.relative}
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
`;

export const label = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.secondary}
`;

export const infoIcon = css`
  ${size.width.xs}
  ${size.height.xs}
  color: ${colors.neutral.gray700}
`;