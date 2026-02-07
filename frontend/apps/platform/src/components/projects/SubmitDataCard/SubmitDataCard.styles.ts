import { css } from '@emotion/react';
import {
  borders,
  colors,
  coloring,
  flex,
  opacity,
  patterns,
  size,
  spacing,
  transitions,
  typography,
  breakpoints,
  position,
  cursor,
} from '@core3/ui-components/styleSystem';

export const container = css`
  ${flex.column}
  ${spacing.gap.m}
  ${size.maxWidth.custom('757px')}
  ${spacing.margin.auto}

  ${breakpoints.lg} {
    ${size.maxWidth.custom('800px')}
  }
  
  ${breakpoints.xxxl} {
    ${size.maxWidth.custom('1000px')}
  }
  
  ${breakpoints.xxxxl} {
    ${size.maxWidth.custom('1400px')}
  }
`;

export const title = css`
  ${typography.fontSize.custom(24)}
  ${typography.fontFamily.primary}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.tight}
  ${coloring.text.primary}
  ${spacing.margin.zero}
`;

export const emailSection = css`
  ${flex.column}
  ${spacing.gap.sm}
`;

export const emailLabel = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs}
`;

export const emailLabelText = css`
  ${typography.fontSize.base}
  ${typography.fontFamily.primary}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.relaxed}
  color: ${colors.neutral.gray650};
`;

export const emailLink = css`
  ${typography.textDecoration.underline}
  ${coloring.text.primary}
`;

export const copyIconWrapper = css`
  ${flex.row}
  ${flex.align.center}
  ${position.relative}
`;

export const copyIconButton = css`
  ${patterns.resetButton}
  ${flex.center}
  ${size.width.sm}
  ${size.height.sm}
  ${cursor.pointer}
  color: ${colors.neutral.gray700};
  ${transitions.opacity}
  
  &:hover {
    ${opacity.veryHigh}
  }
`;

export const copiedTooltip = css`
  ${position.absolute}
  left: 100%;
  ${spacing.margin.left.xs}
  ${typography.fontSize.xs}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
  ${spacing.padding.x.s}
  ${spacing.padding.y.xxs}
  ${borders.radius.base}
  ${coloring.background.dark}
  ${coloring.text.neutral.white}
  ${typography.whiteSpace.nowrap}
  ${transitions.all}
  animation: fadeIn 0.2s ease-in;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(-4px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

export const instructionsText = css`
  ${typography.fontSize.base}
  ${typography.fontFamily.primary}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.relaxed}
  color: ${colors.neutral.gray650};
`;

export const templateBox = css`
  ${flex.column}
  ${spacing.gap.sm}
  ${spacing.padding.sm}
  ${borders.radius.xl}
  background: ${colors.background.light};
`;

export const templateText = css`
  ${typography.fontSize.base}
  ${typography.fontFamily.primary}
  ${typography.fontWeight.normal}
  ${typography.lineHeight.relaxed}
  color: ${colors.text.variants.secondary.op75};
  ${typography.whiteSpace.preLine}
`;

export const buttonsRow = css`
  ${flex.row}
  ${spacing.gap.s}
`;

export const copyButtonWrapper = css`
  ${patterns.resetButton}
  ${borders.custom({
    width: '1.5px',
    style: 'solid',
    color: colors.neutral.gray700,
  })}
  ${borders.radius.full}
  ${spacing.padding.xxs}
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.center}
  ${spacing.gap.xs}
  ${spacing.padding.x.sm}
  ${spacing.padding.y.s}
  ${cursor.pointer}
  ${transitions.all}
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

export const copyIcon = css`
  ${size.width.sm}
  ${size.height.sm}
`;

export const buttonText = css`
  ${typography.fontFamily.mono}
  ${typography.fontWeight.bold}
  ${typography.fontSize.sm}
  ${typography.textTransform.uppercase}
  ${typography.lineHeight.normal}
  ${coloring.text.primary}
`;

