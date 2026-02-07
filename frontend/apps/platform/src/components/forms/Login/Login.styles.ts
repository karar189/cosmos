import {
  borders,
  coloring,
  colors,
  cursor,
  flex,
  opacity,
  spacing,
  typography,
  breakpoints,
  whiteSpace,
} from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const container = css`
  ${flex.column}
  ${spacing.gap.xmd}

  input::placeholder {
    ${coloring.background.transparent}
    ${opacity.moderate}
  }

  input {
    ${coloring.background.transparent}
  }
`;

export const title = css`
  ${flex.center}
  ${typography.fontSize['2xl']};
  ${typography.fontWeight.medium};
  ${typography.fontFamily.primary};
  color: ${colors.text.primary};
  ${whiteSpace.nowrap};

  ${breakpoints.md} {
    ${typography.fontSize['4xl']};
    ${whiteSpace.normal};
  }
`;

export const content = css`
  ${flex.column}
  ${spacing.gap.m}
`;

export const resetLink = css`
  ${typography.textAlign.right};
  ${typography.textDecoration.none};
  ${borders.none};
  background: ${colors.background.paper};
  ${cursor.pointer};
  ${typography.fontSize.sm}
  ${typography.fontFamily.mono}
  ${typography.fontWeight.semibold}
`;

export const terms = css`
  ${flex.center}
  ${typography.fontSize.sm};
  ${typography.fontWeight.medium};
  ${typography.fontFamily.primary};
  color: ${colors.text.secondary};
`;

export const termsLink = css`
  ${typography.fontWeight.medium};
  color: ${colors.text.primary};
`;

export const buttonsWrapper = css`
  ${flex.center}
  ${flex.justify.center}
  ${flex.align.center}
  ${spacing.gap.custom(10)}
  ${typography.fontWeight.bold}
  ${typography.fontFamily.mono}
  ${typography.lineHeight.relaxed}
  ${typography.fontSize.sm}
  ${spacing.padding.s}
  
  button {
    ${spacing.padding.y.xxs}
    ${spacing.padding.x.sm}
    ${typography.lineHeight.tight}
  }
`;
