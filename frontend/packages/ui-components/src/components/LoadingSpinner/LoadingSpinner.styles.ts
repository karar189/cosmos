import { css } from '@emotion/react';
import { colors } from '../../theme/styleSystem';

export const loadingSpinner = css`
  color: ${colors.neutral.black};
  
  & .MuiCircularProgress-svg {
    color: ${colors.neutral.black};
  }
`;