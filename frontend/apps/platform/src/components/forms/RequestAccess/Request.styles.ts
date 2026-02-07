import {
  flex,
  spacing,
  typography,
  size,
  transform,
  colors,
  borders,
  gradients,
} from '@core3/ui-components/styleSystem';
import { css } from '@emotion/react';

export const container = css`
  ${flex.column}
  ${flex.justify.center}
  ${spacing.gap.xmd};
  ${size.maxWidth.sm}
  ${spacing.margin.zero}
`;

export const headings = css`
  ${flex.column}
  ${spacing.gap.xl};
`;

export const tagWrapper = css`
  ${flex.center}
  ${typography.fontSize.xs};
`;

export const continueButton = css`
  ${spacing.margin.top.xs};
  ${size.width.full}

  button {
    ${size.width.full}
  }
`;

export const logo = css`
  ${flex.column}
  ${flex.align.center}
  ${size.width.full}
  ${size.maxWidth.sm}
  ${spacing.margin.zero}
  ${transform.scale(0.85)}
  ${spacing.gap.sm}
`;

export const label = css`
  ${typography.fontSize['2xl']};
  ${typography.fontWeight.medium}
  ${typography.fontFamily.primary}
  ${typography.lineHeight.none}
  ${colors.text.primary}
`;

export const logoImage = css`
  ${size.width.custom('100px')}
  ${size.height.custom('100px')}
  ${borders.radius.circle}
  border: 1px solid ${colors.border.tagBorder};
`;

export const logoGradient = css`
  ${size.width.custom('100px')}
  ${size.height.custom('100px')}
  ${borders.radius.circle}
  border: 1px solid ${colors.border.tagBorder};
  background: ${gradients.logoGradient};
`;

export const intro = css`
  ${flex.column}
  ${flex.center}
  ${spacing.gap.m};
  ${typography.textAlign.center}
  ${typography.fontFamily.primary}
  ${typography.fontWeight.medium}
`;

export const title = css`
  ${typography.fontSize.custom(32)};
  color: ${colors.text.primary};
`;

export const subtitle = css`
  ${typography.fontSize.sm};

  color: ${colors.text.secondary};
`;
