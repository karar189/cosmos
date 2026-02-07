import { flex, spacing, breakpoints, typography, colors } from '../../theme/styleSystem';
import { css } from '@emotion/react';

export const infoListItem = css`
  ${flex.column}
  ${spacing.gap.l}

  ${breakpoints.sm} {
    ${spacing.gap.xl}
  }
`;

export const number = css`
  ${typography.fontSize['2xs']}
  ${typography.fontWeight.medium}
  color: ${colors.semantic.success};
  ${typography.fontFamily.mono}
  letter-spacing: -6%;
`;

export const title = css`
  ${typography.fontSize['2xl']}
  ${typography.fontWeight.medium}
  color: ${colors.semantic.success};

  ${breakpoints.sm} {
    ${typography.fontSize['3xl']}
  }
`;

export const description = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.normal}
  white-space: pre-line;

  ${breakpoints.sm} {
    ${typography.fontSize.base}
  }
`;
