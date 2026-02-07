import { css } from '@emotion/react';
import { flex, size, spacing } from '@core3/ui-components/styleSystem';

export const container = css`
  display: flex;
  ${flex.base};
  ${flex.column};
  ${spacing.gap.s};
  ${size.width.full}; 
`;
