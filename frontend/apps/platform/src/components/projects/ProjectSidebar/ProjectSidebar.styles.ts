import { css } from '@emotion/react';
import { colors, flex, overflow, size, spacing } from '@core3/ui-components/styleSystem';

export const container = css`
  ${flex.column};
  ${spacing.gap.m};
  ${spacing.padding.l};
  border-left: 1px solid ${colors.text.variants.secondary.op25};
  ${size.height.full}
  ${size.width.full};
  ${size.maxWidth.full};
  ${overflow.y.auto};
  ${overflow.x.hidden};
  background-color: ${colors.background.default};
  box-sizing: border-box;
`;
