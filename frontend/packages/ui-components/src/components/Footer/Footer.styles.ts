import { css } from '@emotion/react';
import {
  flex,
  spacing,
  typography,
  colors,
  size,
  breakpoints,
  position,
  transitions,
  coloring,
  borders,
} from '../../theme/styleSystem';

export const footer = css`
  ${position.relative}
  padding-top: 15vw;
  ${spacing.padding.x.l}
  background: ${colors.text.primary};
  ${position.zIndex.dropdown}

  ${breakpoints.md} {
    ${spacing.padding.x.xxl}
  }
`;

export const footerCompact = css`
  ${position.relative}
  background: ${colors.text.primary};
  ${position.zIndex.dropdown}

  /* Tiny footer: smaller than header, still with breathing room */
  padding: 10px 16px;

  ${breakpoints.md} {
    padding: 10px 24px;
  }
`;

export const footerText = css`
  color: ${colors.semantic.warning};
  ${typography.fontWeight.medium}
  ${typography.lineHeight.none}
  ${typography.fontSize['3.5xl']}

  span {
    color: ${colors.semantic.success};
  }
`;

export const footerTextCompact = css`
  color: ${colors.semantic.warning};
  ${typography.fontFamily.mono}
  ${typography.fontWeight.medium}
  ${typography.textAlign.center}

  /* Really small */
  ${typography.fontSize.xs}
  line-height: 1.1;

  /* Extra padding above/below the text (as requested) */
  padding: 6px 0;
`;

export const links = css`
  ${spacing.padding.y.xxl}
  ${flex.column}
  ${flex.justify.between}
  ${spacing.gap.xxl}
  ${typography.fontFamily.mono}
  ${typography.fontSize.sm}
  ${typography.textTransform.uppercase}
  ${coloring.text.neutral.white}

  ${breakpoints.md} {
    ${flex.row}
  }
`;

export const linksGroup = css`
  ${flex.column}
  ${spacing.gap.m}

  ${breakpoints.md} {
    ${flex.row}
    ${spacing.gap.xl}
  }
`;

export const link = css`
  ${coloring.text.neutral.white}
  ${typography.textDecoration.none}
  ${transitions.colors}
  ${spacing.padding.y.xs}
  ${typography.textTransform.uppercase}

  &:hover {
    color: ${colors.semantic.warning};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary.main};
    outline-offset: 2px;
    ${borders.radius.sm}
  }
`;

export const linkButton = css`
  background: none;
  ${borders.none}
  ${spacing.padding.zero}
  ${spacing.padding.y.xs}
  cursor: pointer;
  ${typography.textAlign.left}
  font: inherit;
  ${coloring.text.neutral.white}
  ${transitions.colors}
  ${typography.textTransform.uppercase}

  &:hover {
    color: ${colors.semantic.warning};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary.main};
    outline-offset: 2px;
    ${borders.radius.sm}
  }
`;

export const imageWrapper = css`
  ${size.width.full}
  ${flex.row}

  img {
    position: relative !important;
    width: 100% !important;
    height: auto !important;
  }
`;

