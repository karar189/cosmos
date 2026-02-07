import { breakpoints, grid, position, spacing } from '../../theme/styleSystem';
import { css } from '@emotion/react';

export const infoList = css`
  ${position.relative}
  ${grid.base}
  ${grid.cols(1)}
  ${spacing.gap.xl}

  ${breakpoints.sm} {
    ${grid.cols(2)}
  }
  ${breakpoints.xl} {
    ${grid.cols(4)}
  }
`;
