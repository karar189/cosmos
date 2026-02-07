import { css } from '@emotion/react';
import { colors, flex, typography, size, spacing, whiteSpace, coloring } from '@core3/ui-components/styleSystem';

export const container = css`
  ${flex.row}
  ${flex.justify.between}
  ${flex.align.center}
  ${size.width.full}
  ${spacing.gap.s}
`;

export const label = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  color: ${colors.neutral.gray700};
  flex-shrink: 0;
`;

export const rightSection = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
  flex-shrink: 0;
`;

export const progressWrapper = css`
  ${flex.base}
  ${flex.align.center}
`;

export const valueLabel = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
  ${typography.textAlign.right};
  ${size.width.xxl};
  ${whiteSpace.nowrap}
`;

export const valueLabelMax = css`
  color: ${colors.neutral.gray700};
`;

export const naText = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  color: ${colors.neutral.gray700};
  ${typography.textAlign.right};
  ${size.width.xxl};
`;
