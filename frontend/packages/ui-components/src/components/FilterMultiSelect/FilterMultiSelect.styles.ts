/**
 * FilterMultiSelect Component Styles
 * Styles for the multi-select dropdown component with search
 */

import { css } from '@emotion/react';
import { colors, typography, spacing, borders, transitions, flex, size, spacingValues, position, sizeValues, patterns, opacity, pointerEvents } from '../../theme/styleSystem';

/**
 * Select input styles
 */
export const select = css`
  /* Default outline color */
  & .MuiOutlinedInput-notchedOutline {
    border-color: ${colors.neutral.black};
    ${borders.all}
    border-width: 1px;
    ${borders.radius['3xl']}
  }

  /* Hover state */
  &:hover .MuiOutlinedInput-notchedOutline {
    border-width: 1px;
  }

  /* Focused/Active state */
  &.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: ${colors.neutral.black};
    border-width: 1px;
  }

  /* Input text styling */
  & .MuiSelect-select {
    ${typography.fontSize.sm}
    ${typography.fontWeight.medium}
    color: ${colors.neutral.black};
    ${spacing.padding.x.m}
    ${spacing.padding.y.xs}
    margin-top: 1px;
    ${patterns.truncate}
    ${size.maxWidth.full}
  }

  /* Select border when dropdown is open - 2px border */
  & .MuiSelect-select[aria-expanded='true'] ~ .MuiOutlinedInput-notchedOutline {
    border-width: 2px;
  }
`;

/**
 * Placeholder and selected count container
 */
export const placeholder = css`
  ${flex.centerCross}
  ${spacing.gap.s}
  ${spacing.margin.right.m}
`;

/**
 * Selected values count badge
 */
export const selectedValuesChip = css`
  ${size.width.xsm}
  ${size.height.xsm}
  padding-top: 1px;
  ${flex.center}
  background-color: ${colors.neutral.black};
  ${borders.radius.full}
  ${typography.fontSize.xs}
  color: ${colors.neutral.white};
`;

/**
 * Checkbox styles
 */
export const checkbox = css`
  &.MuiCheckbox-root {
    & svg {
      fill: ${colors.neutral.gray400};
    }
  }

  &.Mui-checked {
    & svg {
      fill: ${colors.neutral.black};
    }
  }
`;

/**
 * Option label container
 */
export const optionLabel = css`
  ${size.width.full}
  ${flex.centerCross}
  ${flex.justify.between}
  ${spacing.gap.s}
`;

/**
 * Option count badge
 */
export const optionCount = css`
  ${opacity.moderate}
  ${typography.fontSize.sm}
  ${spacing.padding.right.m}

`;

/**
 * Custom chevron icon styles
 */
export const selectIcon = css`
  ${position.absolute}
  right: ${spacingValues.m};
  ${pointerEvents.none}
  ${flex.center}
  
  & svg {
    ${size.width.sm}
    ${size.height.sm}
    fill: ${colors.neutral.black};
  }
`;

/**
 * Search MenuItem container (sticky at top)
 */
export const searchMenuItem = css`
  ${pointerEvents.none}
  ${position.sticky}
  ${position.top.zero}
  ${position.zIndex.above}
  background-color: ${colors.neutral.white};
  ${spacing.padding.x.m}
  ${spacing.padding.top.xs}
  ${spacing.padding.bottom.m}
  
  &:hover {
    background-color: ${colors.neutral.white};
  }

  &.Mui-focusVisible {
    background-color: ${colors.neutral.white};
  }
`;

/**
 * Search input styles
 */
export const searchInput = css`
  ${pointerEvents.auto}
  & .MuiOutlinedInput-root {
    ${borders.radius['3xl']}
    ${typography.fontSize.sm}
    ${typography.fontWeight.medium}
    
    & fieldset {
      border-color: ${colors.neutral.gray300};
      ${transitions.colors}
    }
    
    &.Mui-focused fieldset {
      border-color: ${colors.neutral.black};
      border-width: 2px;
    }
  }
  
  & .MuiInputBase-input {
    ${typography.fontSize.sm}
  }
`;

/**
 * Search icon inside input
 */
export const searchIcon = css`
  & svg {
    ${size.width.sm}
    ${size.height.sm}
    fill: ${colors.neutral.gray500};
  }
`;

/**
 * No results message
 */
export const noResults = css`
  ${typography.fontSize.sm}
  color: ${colors.neutral.gray500};
  ${typography.textAlign.center}
  ${spacing.margin.left.m}
  
  &:hover {
    background-color: transparent;
  }
`;

/**
 * Dropdown menu styles (for MUI sx prop)
 */
export const selectMenuStyles = css`
  .MuiPaper-root {
    background-color: ${colors.neutral.white};
    box-shadow: none;
    ${size.width['4xl']}
    max-height: ${sizeValues['5xl']};
    ${spacing.margin.top.xs}
    border: 2px solid ${colors.neutral.black};
    ${borders.radius['3xl']}
    
    /* Hide scrollbar but keep scrolling */
    /* Firefox */
    scrollbar-width: none;
    
    /* Chrome, Safari, Edge */
    &::-webkit-scrollbar {
      display: none;
    }
  }

  .MuiList-root {
    ${size.width.full}
  }

  /* MenuItem hover and active states */
  .MuiMenuItem-root {
    ${size.height.lg}
    ${spacing.padding.x.xs}
    ${spacing.padding.y.xs}
    ${transitions.colors}
    ${typography.fontSize.sm}
    ${typography.fontWeight.medium}
    color: ${colors.neutral.black};
    white-space: normal;
    word-wrap: break-word;
    border: none;

    &:hover {
      background-color: ${colors.star.unfilled};
    }

    &.Mui-selected {
      background-color: ${colors.neutral.white};
      
      &:hover {
        background-color: ${colors.star.unfilled};
      }
    }
  }
`;

