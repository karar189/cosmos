import {
  flex,
  spacing,
  typography,
  colors,
  coloring,
  opacity,
  breakpoints,
  size,
  whiteSpace,
} from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const container = css`
  ${flex.column}
  ${flex.justify.center}
  ${spacing.gap.m};
  ${spacing.gap.xmd};
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

export const form = css`
  ${flex.column}
  ${spacing.gap.m};

  input::placeholder {
    ${coloring.background.transparent}
    ${opacity.moderate}
  }

  input {
    ${coloring.background.transparent}
  }

  button[type="submit"] {
    ${size.width.full}
  }
`;

export const StyledFormBoxFooter = css`
  ${flex.center};
  ${flex.justify.center};
  ${spacing.padding.m};
  ${typography.fontSize.sm};
  ${typography.lineHeight.relaxed};
  ${typography.fontWeight.medium};
  ${typography.fontFamily.primary};
`;

export const StyledFormBoxSpanText = css`
  color: ${colors.text.secondary};
`;

export const StyledFormBoxSpanBold = css`
  ${typography.fontWeight.bold};
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
