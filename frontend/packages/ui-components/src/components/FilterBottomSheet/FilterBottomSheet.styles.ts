import { css } from '@emotion/react';
import {
  borders,
  coloring,
  colors,
  cursor,
  display,
  flex,
  patterns,
  size,
  sizeValues,
  spacing,
  spacingValues,
  transitions,
  typography,
} from '../../theme/styleSystem';

export const backButton = css`
  ${patterns.resetButton}
  ${size.width.custom('36px')}
  ${size.height.custom('36px')}
  ${display.flex}
  ${flex.center}
  ${borders.radius.circle}
  ${cursor.pointer}
  ${transitions.all}
  background-color: ${colors.neutral.white};
  border: ${spacingValues.xxxs} solid ${colors.neutral.gray700};
  margin-right: ${spacingValues.m};
  
  svg {
    width: ${sizeValues.xsm};
    height: ${sizeValues.xsm};
    color: ${colors.text.primary};
  }
  
  &:hover {
    background-color: ${colors.background.hover};
  }
  
  &:focus-visible {
    outline: 2px solid ${colors.primary.main};
    outline-offset: 2px;
  }
`;

export const title = css`
  ${typography.fontSize['xl']}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
  ${spacing.margin.zero}
  flex: 1;
`;

export const closeButton = css`
  ${patterns.resetButton}
  ${size.width.custom('40px')}
  ${size.height.custom('40px')}
  ${display.flex}
  ${flex.center}
  ${borders.radius.circle}
  ${cursor.pointer}
  ${transitions.all}
  
  svg {
    width: ${sizeValues.md};
    height: ${sizeValues.md};
    color: ${colors.neutral.gray600};
  }
  
  &:hover {
    background-color: ${colors.background.hover};
  }
  
  &:focus-visible {
    outline: 2px solid ${colors.primary.main};
    outline-offset: 2px;
  }
`;

export const contentWrapper = css`
  ${display.flex}
  ${flex.column}
  ${flex.item.grow}
  overflow-y: auto;
  min-height: 0;
  ${spacing.padding.bottom.m}
`;

export const categoryList = css`
  ${display.flex}
  ${flex.column}
`;

export const categoryItem = css`
  ${display.flex}
  ${flex.row}
  ${flex.align.center}
  ${flex.justify.between}
  ${spacing.padding.y.xs}
  ${cursor.pointer}
  ${transitions.all}
  
  &:hover {
    opacity: 0.8;
  }
`;

export const categoryLabel = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  ${coloring.text.primary}
`;

export const categoryRight = css`
  ${display.flex}
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.s}
`;

export const categoryBadge = css`
  ${display.flex}
  ${flex.center}
  ${size.width.lg}
  ${size.height.lg}
  ${borders.radius.circle}
  background-color: ${colors.text.primary};
  color: ${colors.neutral.white};
  ${typography.fontSize.sm}
  ${typography.fontWeight.semibold}
  
`;

export const categoryChevron = css`
  ${spacing.padding.right.s}
  svg {
    width: ${sizeValues.sm};
    height: ${sizeValues.xsm};
    color: ${colors.text.primary};

  }
`;

export const actions = css`
  ${display.flex}
  ${flex.row}
  ${spacing.gap.m}
  ${spacing.padding.y.m}
  ${spacing.padding.x.zero}
  ${spacing.margin.top.auto}
  flex-shrink: 0;
`;

export const clearButton = css`
  flex: 1;
  ${display.flex}
  ${flex.center}
  ${spacing.padding.y.s}
  ${spacing.padding.x.l}
  ${typography.fontSize.base}
  ${typography.fontWeight.semibold}
  ${typography.fontFamily.mono}
  ${typography.textTransform.uppercase}
  ${typography.letterSpacing.normal}
  ${coloring.text.primary}
  background: transparent;
  border: ${spacingValues.hairline} solid ${colors.neutral.gray700};
  ${borders.radius.full}
  ${cursor.pointer}
  ${transitions.all}

  &:hover:not(:disabled) {
    background-color: ${colors.background.hover};
  }

  &:focus-visible {
    outline: ${spacingValues.xxxs} solid ${colors.primary.main};
    outline-offset: ${spacingValues.xxxs};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const applyButton = css`
  flex: 1.4;
  ${flex.center}
  ${spacing.padding.xxs}
  background: transparent;
  border: ${spacingValues.hairline} solid ${colors.text.primary};
  ${borders.radius.full}
  ${cursor.pointer}
  ${transitions.all}

  &:focus-visible {
    outline: ${spacingValues.xxxs} solid ${colors.primary.main};
    outline-offset: ${spacingValues.xxxs};
  }
  
  & > span {
    ${display.flex}
    ${flex.center}
    ${size.width.full}
    ${spacing.padding.y.s}
    ${spacing.padding.x.l}
    ${typography.fontSize.base}
    ${typography.fontWeight.semibold}
    ${typography.fontFamily.mono}
    ${typography.textTransform.uppercase}
    ${typography.letterSpacing.widest}
    color: ${colors.neutral.white};
    background-color: ${colors.text.primary};
    ${borders.radius.full}
    ${transitions.all}
  }
  
  &:hover > span {
    opacity: 0.9;
  }
`;

export const optionsList = css`
  ${display.flex}
  ${flex.column}
  ${spacing.padding.bottom.zero}
`;

