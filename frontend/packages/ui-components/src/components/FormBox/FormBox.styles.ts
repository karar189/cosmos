import {
  borders,
  colors,
  flex,
  position,
  spacing,
  typography,
  size,
  breakpoints,
} from '../../theme/styleSystem';
import { css } from '@emotion/react';

export const StyledFormBox = css`
  ${spacing.padding.top.l}
  ${spacing.padding.bottom.l}
  ${spacing.padding.x.m}
  ${size.height.auto}
  ${size.minHeight.screen}
  ${size.width.full}
  ${size.maxWidth.full}
  ${flex.column}
  ${flex.justify.between}
  gap: ${spacing.gap.s};
  ${borders.radius['2xl']}
  background: ${colors.background.paper};
  box-sizing: border-box;
  ${position.relative}
  ${spacing.margin.bottom.zero}

  ${breakpoints.md} {
    ${spacing.padding.top.xxl}
    ${spacing.padding.bottom.xl}
    ${spacing.padding.x.xl}
    ${borders.radius['4xl']}
    ${size.height.auto}
    ${size.minHeight.auto}
  }

  ${breakpoints.lg} {
    ${spacing.padding.x.xxxl}
  }

  ${breakpoints.xlg} {
    ${spacing.padding.top.custom('7rem')}
    ${spacing.padding.right.custom('8rem')}
    ${spacing.padding.bottom.xl}
    ${spacing.padding.left.custom('8rem')}
  }
`;

export const StyledFormBoxFooter = css`
  ${flex.centerMain}
  ${spacing.padding.m}
  ${spacing.padding.bottom.xl}
  ${spacing.padding.top.m}
  ${typography.fontSize.sm};
  ${typography.lineHeight.relaxed};
  ${typography.fontWeight.medium};
  ${typography.fontFamily.primary};
  ${spacing.margin.top.auto}

  ${breakpoints.md} {
    ${spacing.margin.top.zero}
  }
`;

export const StyledFormBoxSpanText = css`
  color: ${colors.text.secondary};
`;

export const StyledFormBoxSpanBold = css`
  ${typography.fontWeight.bold};
  color: ${colors.text.primary};
`;
