import { css } from '@emotion/react';
import {
  flex,
  spacing,
  colors,
  typography,
  borders,
  transitions,
  breakpoints,
  size,
  boxShadow,
  coloring,
} from '@core3/ui-components/styleSystem';

export const chartCard = css`
  ${flex.column}
  ${coloring.background.neutral.default}
  ${borders.radius.lg}
  ${spacing.padding.l}
  ${spacing.gap.m}
  ${boxShadow.sm}
`;

export const header = css`
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${spacing.gap.m}
  ${flex.wrap.wrap}

  ${breakpoints.sm} {
    ${flex.wrap.nowrap}
  }
`;

export const toggleGroup = css`
  ${coloring.background.light}
  ${borders.radius.full}
  ${spacing.padding.x.xxxs}
  ${spacing.padding.y.xxxxs}
  ${size.width.auto}
  ${size.height.auto}
  ${flex.base}
  ${flex.align.center}
  ${spacing.gap.zero}
`;

export const toggleButton = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.medium}
  ${typography.fontSize.xs}
  ${typography.letterSpacing.normal}
  ${typography.lineHeight.tight}
  ${typography.textTransform.none}
  ${coloring.text.primary}
  ${size.minWidth.auto}
  ${spacing.padding.x.s}
  ${spacing.padding.y.xs}
  ${borders.radius.lg}
  ${transitions.all}
  ${size.height.auto}
  ${flex.base}
  ${flex.align.center}
  ${flex.justify.center}
  /* 
   * !important is required here because Material-UI ToggleButton components apply high-specificity
   * inline styles and CSS classes that override our custom styles. MUI uses specificity
   * tricks (e.g., .MuiToggleButton-root.MuiToggleButton-text) that require !important to override.
   * 
   * We cannot use CSS nesting (e.g., > div button) because:
   * 1. Emotion CSS-in-JS doesn't support native CSS nesting syntax
   * 2. MUI components render with dynamic class names and internal structure we can't reliably target
   * 3. The component hierarchy is controlled by MUI, not our markup
   */
  ${borders.none}

  &.Mui-selected {
    /* 
     * !important required to override MUI ToggleButton's default selected state styles.
     * MUI applies styles with high specificity that would otherwise override our custom styling.
     */
    background-color: ${colors.neutral.white} !important;
    color: ${colors.text.primary} !important;
    ${typography.fontWeight.medium}
    ${borders.radius['2xl']}
    /* Specific padding values needed for visual alignment with MUI's internal spacing */
  


    &:hover {
      /* !important needed to maintain selected state styling on hover */
      background-color: ${colors.neutral.white} !important;
      color: ${colors.text.primary} !important;
    }

    &:focus,
    &:focus-visible,
    &:active {
      /* !important needed to maintain selected state styling on focus/active states */
      background-color: ${colors.neutral.white} !important;
      color: ${colors.text.primary} !important;
    }
  }

  &:hover {
    background-color: transparent;
    ${coloring.text.secondary}
  }

  &:focus,
  &:focus-visible,
  &:active {
    /* !important needed to override MUI's focus state styles */
    outline: none !important;
    box-shadow: none !important;
    background-color: transparent;
  }

  &.Mui-focusVisible {
    /* !important needed to override MUI's focus-visible pseudo-class styles */
    outline: none !important;
    box-shadow: none !important;
  }
`;

export const timeRangeContainer = css`
  ${flex.row}
  ${coloring.background.light}
  ${borders.radius.full}
  ${spacing.padding.x.xxxs}
  ${spacing.padding.y.xxxxs}
  ${size.width.auto}
  ${size.height.auto}
  ${flex.base}
  ${flex.align.center}
  ${spacing.gap.zero}
  ${spacing.margin.right.m}
`;

export const timeRangeButton = css`
  ${typography.fontFamily.primary}
  ${typography.fontWeight.medium}
  ${typography.fontSize.xs}
  ${typography.letterSpacing.normal}
  ${typography.lineHeight.tight}
  ${typography.textTransform.none}
  ${coloring.text.primary}
  ${size.minWidth.auto}
  ${spacing.padding.x.sm}
  ${spacing.padding.y.xs}
  ${borders.radius.lg}
  ${transitions.all}
  ${flex.base}
  ${flex.align.center}
  ${flex.justify.center}
  /* 
   * !important is required here because Material-UI Button components apply high-specificity
   * inline styles and CSS classes that override our custom styles. MUI uses specificity
   * tricks (e.g., .MuiButton-root.MuiButton-text) that require !important to override.
   * 
   * We cannot use CSS nesting (e.g., > div button) because:
   * 1. Emotion CSS-in-JS doesn't support native CSS nesting syntax
   * 2. MUI components render with dynamic class names and internal structure we can't reliably target
   * 3. The component hierarchy is controlled by MUI, not our markup
   */
  ${borders.none}

  &:hover {
    background-color: transparent;
    ${coloring.text.secondary}
  }

  &:focus,
  &:focus-visible,
  &:active {
    /* !important needed to override MUI's focus state styles */
    outline: none !important;
    box-shadow: none !important;
    background-color: transparent;
  }

  &.Mui-focusVisible {
    /* !important needed to override MUI's focus-visible pseudo-class styles */
    outline: none !important;
    box-shadow: none !important;
  }
`;

export const timeRangeButtonActive = css`
  /* 
   * !important required to override MUI Button's default active/selected state styles.
   * MUI applies styles with high specificity that would otherwise override our custom styling.
   */
  background-color: ${colors.neutral.white} !important;
  color: ${colors.text.primary} !important;
  ${typography.fontWeight.medium}
  ${borders.radius.xl}
  /* Specific padding values needed for visual alignment with MUI's internal spacing */

  &:hover {
    /* !important needed to maintain active state styling on hover */
    background-color: ${colors.neutral.white} !important;
    color: ${colors.text.primary} !important;
  }

  &:focus,
  &:focus-visible,
  &:active {
    /* !important needed to maintain active state styling on focus/active states */
    background-color: ${colors.neutral.white} !important;
    color: ${colors.text.primary} !important;
  }
`;

export const chartContainer = css`
  ${flex.column}
  ${size.width.full}
  ${size.height.full}
  ${spacing.margin.top.m}
  ${coloring.background.neutral.default}
  ${borders.radius.base}
`;

export const axisTick = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.xs}
  ${typography.fontWeight.normal}
`;

export const yAxisTick = css`
  ${typography.fontFamily.primary}
  ${typography.fontSize.xs}
  ${typography.fontWeight.normal}
`;

