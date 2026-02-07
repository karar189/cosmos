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
  ${spacing.margin.left.zero}
`;

