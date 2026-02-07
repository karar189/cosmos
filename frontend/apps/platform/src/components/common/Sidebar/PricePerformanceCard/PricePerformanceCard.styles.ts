import { css } from '@emotion/react';
import { colors, typography, flex, size, position, spacingValues, borders, spacing, shadows, transitions, cursor } from '@core3/ui-components/styleSystem';

export const divider = css`
  ${size.width.full};
  height: ${spacingValues.hairline};
  background-color: ${colors.text.variants.secondary.op25};
`;

export const section = css`
  ${flex.column};
  ${spacing.gap.sm}
  ${size.width.full};
`;

export const sectionTitle = css`
  ${typography.fontFamily.primary};
  ${typography.fontSize.base};
  ${typography.fontWeight.medium};
  ${typography.lineHeight.normal};
  color: ${colors.text.primary};
`;

export const priceHeader = css`
  ${flex.row};
  ${flex.centerCross};
  ${flex.justify.between};
  ${size.width.full};
`;

export const periodDropdown = css`
  ${position.relative}
`;
export const periodBadgeContent = css`
${flex.base};
${flex.align.center};
${spacing.gap.xxs};
`;

export const periodMenu = css`
  ${position.absolute};
  top: calc(100% + ${spacingValues.xs});
  ${position.right.zero};
  background: ${colors.neutral.white};
  ${borders.all};
  ${borders.radius.lg};
  ${spacing.padding.xs};
  ${size.minWidth.custom('80px')};
  ${position.zIndex.dropdown};
  ${shadows.s}
`;

export const periodMenuItem = (isSelected: boolean) => css`
  ${spacing.padding.y.s}
  ${spacing.padding.x.sm}
  ${typography.fontFamily.primary};
  ${typography.fontSize.sm};
  ${typography.fontWeight.medium};
  color: ${isSelected ? colors.text.primary : colors.text.variants.secondary.op65};
  background: ${isSelected ? colors.background.component : 'transparent'};
  ${borders.none};
  ${borders.radius.base};
  ${cursor.pointer};
  ${transitions.background}
  ${size.width.full};
  ${typography.textAlign.left}

  &:hover {
    background: ${colors.background.component};
  }
`;

export const priceRange = css`
  ${flex.row};
  ${flex.justify.between};
  ${size.width.full};
`;

export const priceRangeItem = css`
  ${flex.column};
  ${spacing.gap.xxxs}
`;
export const priceRangeItemEnd = css`
  ${flex.align.end }
`;

export const priceRangeLabel = css`
  ${typography.fontFamily.primary};
  ${typography.fontSize.xs};
  ${typography.fontWeight.medium};
  ${typography.lineHeight.tight};
  color: ${colors.text.variants.secondary.op65};
`;

export const priceRangeValue = css`
  ${typography.fontFamily.mono};
  ${typography.fontSize.sm};
  ${typography.fontWeight.medium};
  ${typography.lineHeight.normal};
  color: ${colors.text.primary};
`;

export const priceBarWrapper = css`
  ${position.relative};
  ${size.width.full};
  ${size.height.xxs}
`;

export const priceBar = css`
  ${size.width.full};
  height: ${spacingValues.xxs};
  ${size.height.xxxs}
  background: ${colors.background.card};
  ${borders.radius.base};
`;

export const priceBarIndicator = css`
  ${position.absolute};
  top: -${spacingValues.xxxs};
  width: ${spacingValues.xxxs};
  height: ${spacingValues.sm};
  background: ${colors.text.primary};
  
`;

export const priceStatsContainer = css`
  ${flex.column};
  ${spacing.gap.sm}
  ${size.width.full};
`;

export const priceStat = css`
  ${flex.row};
  ${flex.centerCross};
  ${flex.justify.between};
  ${size.width.full};
`;

export const priceStatLeft = css`
  ${flex.column};
  ${spacing.gap.zero}
  ${flex.align.start};
`;

export const priceStatHeader = css`
  ${flex.row};
  ${flex.centerCross};
  ${spacing.gap.xs};
`;

export const priceStatTitle = css`
  ${typography.fontFamily.primary};
  ${typography.fontSize.sm};
  ${typography.fontWeight.medium};
  ${typography.lineHeight.normal};
  color: ${colors.text.primary};
`;

export const priceStatDate = css`
  ${typography.fontFamily.primary};
  ${typography.fontSize.xs};
  ${typography.fontWeight.normal};
  ${typography.lineHeight.tight};
  color: ${colors.text.variants.secondary.op65};
`;

export const priceStatRight = css`
  ${flex.column};
  ${spacing.gap.zero}
  ${flex.align.end};
`;

export const priceStatPrice = css`
  ${typography.fontFamily.mono};
  ${typography.fontSize.sm};
  ${typography.fontWeight.medium};
  ${typography.lineHeight.normal};
  color: ${colors.text.primary};
`;
export const priceStatChangeNegative = css`
  ${typography.fontFamily.mono};
  ${typography.fontSize.xs};
  ${typography.fontWeight.normal};
  ${typography.lineHeight.tight};
  color: ${colors.semantic.error};
`;
export const priceStatChangePositive = css`
  ${typography.fontFamily.mono};
    ${typography.fontSize.xs};
  ${typography.fontWeight.normal};
  ${typography.lineHeight.tight};
  color: ${colors.semantic.success};
`;