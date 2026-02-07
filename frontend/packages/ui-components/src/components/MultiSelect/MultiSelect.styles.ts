/**
 * MultiSelect Component Styles
 * Styles for the multi-select dropdown component
 */

import { css } from '@emotion/react';
import { colors, typography, spacing, borders, transitions, flex, size, spacingValues, position, sizeValues, opacity, pointerEvents, patterns } from '../../theme/styleSystem';

/**
 * Container wrapper
 */
export const container = css`
`;

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


export const placeholder = css`
  ${flex.centerCross}
  ${spacing.gap.s}
  margin-right: ${spacingValues.m};
`;

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
 * Option count
 */
export const optionCount = css`
  ${opacity.moderate}
  ${typography.fontSize.sm}
`;

/**
 * Custom icon styles
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
 * Dropdown menu styles (for MUI sx prop)
 */
export const selectMenuStyles = css`
  .MuiPaper-root {
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
    ${spacing.padding.right.m}
    ${spacing.padding.y.xs}
    ${transitions.colors}
    ${typography.fontSize.sm}
    ${typography.fontWeight.medium}
    color: ${colors.neutral.black};
    white-space: normal;
    word-wrap: break-word;

    &:hover {
      background-color: ${colors.background.paper};
    }

    &.Mui-selected {
      &:hover {
        background-color: ${colors.background.paper};
      }
    }
  }
`;

