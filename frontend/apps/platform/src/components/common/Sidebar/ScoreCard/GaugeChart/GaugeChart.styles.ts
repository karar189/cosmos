import { css } from '@emotion/react';
import { colors, flex, position, spacing, typography } from '@core3/ui-components/styleSystem';

export const container = css`
  ${position.relative}
  /* Width and height are set dynamically via inline style for responsive scaling */
`;

export const overlayContent = css`
  ${position.absolute}
  top: 30%;
  ${position.left.zero}
  ${position.right.zero}
  ${position.bottom.zero}
  ${flex.column}
  ${flex.align.center}
  ${flex.justify.center}
  pointer-events: none;
`;

export const scoreSection = css`
  ${flex.column}
  ${flex.align.center}
  ${flex.justify.center}
  ${spacing.gap.s}
  pointer-events: auto;
`;

export const ratingBadge = css`
  ${spacing.margin.bottom.negative.sm}
`;

export const score = css`
  ${typography.fontFamily.mono}
  ${typography.fontSize['4xl']}
  ${typography.fontWeight.semibold}
  ${typography.lineHeight.normal}
  color: ${colors.neutral.black};
  ${typography.textAlign.center}
`;

export const metaInfo = css`
  ${flex.row}
  ${flex.align.start}
  ${flex.justify.center}
  ${spacing.gap.s}
  pointer-events: auto;
`;

export const metaText = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.custom(10)}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.none}
  color: ${colors.neutral.gray700};
`;

export const metaValue = css`
  color: ${colors.neutral.black};
`;
