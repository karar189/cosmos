import { css } from "@emotion/react";
import { colors, spacing, typography } from "@core3/ui-components/styleSystem";

export const categorySubtitle = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${typography.fontFamily.mono}
  ${typography.textTransform.uppercase}
  color: ${colors.text.secondary};
  ${spacing.margin.top.m}
  ${spacing.margin.bottom.xs}
  ${spacing.margin.left.sm}
`;

export const noResults = css`
  ${spacing.padding.m}
  ${spacing.margin.left.s}
  ${typography.fontSize.sm}
  color: ${colors.text.secondary};
  ${typography.textAlign.center}
`;

export const tabContent = css`
  ${spacing.padding.top.s}
`;
