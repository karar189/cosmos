import { css } from '@emotion/react';
import {
  spacing,
  typography,
  breakpoints,
  colors,
  grid,
  flex,
  size,
  borders,
  transitions,
  position,
  spacingValues,
  opacity,
  overflow,
  coloring,
} from '@core3/ui-components/styleSystem';

// MUI Inputs style overrides
export const formStyles = css`
  ${flex.column}
  ${flex.item.grow}

  /* TextField/Input customization */
  .MuiOutlinedInput-root {
    /* Default outline color */
    & .MuiOutlinedInput-notchedOutline {
      border-color: ${colors.neutral.black};
      ${borders.all}
    }

    /* Hover state */
    &:hover .MuiOutlinedInput-notchedOutline {
      border-width: 2px;
    }

    /* Focused/Active state */
    &.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: ${colors.neutral.black};
      border-width: 2px;
    }

    /* Error state - must come after default styles to override */
    &.Mui-error .MuiOutlinedInput-notchedOutline {
      border-color: ${colors.semantic.error};
      ${borders.all}
    }
    
    /* Error state focus - higher specificity to override focused state */
    &.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: ${colors.semantic.error};
      border-width: 2px;
    }

    /* Input text color */
    & .MuiInputBase-input {
      margin-top: 1px;
      ${typography.fontSize.sm}
      ${typography.fontWeight.medium}
      color: ${colors.neutral.black};
      ${spacing.padding.x.m}
      ${spacing.padding.y.s}

      /* Placeholder color */
      &::placeholder {
        color: ${colors.neutral.black};
        ${opacity.full}
      }
    }

    /* Remove padding from multiline wrapper to avoid duplicate padding */
    &.MuiInputBase-multiline {
      ${spacing.padding.zero}
    }
  }

  /* Select dropdown customization */
  .MuiSelect-select {
    color: ${colors.text.primary};
    ${overflow.hidden}
    text-overflow: ellipsis;
    white-space: nowrap;
    ${size.maxWidth.full}
  }

  /* Select input wrapper - prevent overflow */
  .MuiInputBase-formControl {
    ${size.maxWidth.full}
  }

  /* Select border when dropdown is open - remove bottom border to merge with dropdown */
  /* Using !important here because MUI applies inline styles that need to be overridden */
  .MuiSelect-select[aria-expanded='true'] ~ .MuiOutlinedInput-notchedOutline {
    border-bottom: none !important;  /* Required to override MUI inline styles */
    border-bottom-left-radius: 0 !important;  /* Required for visual continuity with dropdown */
    border-bottom-right-radius: 0 !important;  /* Required for visual continuity with dropdown */
  }
`;

// Select dropdown menu styles (must be separate to target the portal)
/* Using !important here because MUI Select renders dropdown in a Portal outside the component tree,
   and MUI applies its own inline styles that have higher specificity */
export const selectMenuStyles = css`
  .MuiPaper-root {
    box-shadow: none !important;  /* Required to override MUI's default shadow inline styles */
    border-width: 2px;
    border-style: solid;
    border-color: ${colors.neutral.black};
    margin-top: 0 !important;  /* Required to override MUI's positioning calculations */
    ${coloring.background.paper}

    ${breakpoints.md} {
      border-top: none !important;  /* Required for visual continuity with select input */
      border-top-left-radius: 0 !important;  /* Required for visual continuity with select input */
      border-top-right-radius: 0 !important;  /* Required for visual continuity with select input */
    }
  }

  /* MenuItem hover and active states */
  .MuiMenuItem-root {
    ${transitions.colors}
    ${typography.fontSize.sm}
    ${typography.fontWeight.normal}
    color: ${colors.neutral.black};
    ${coloring.background.paper}
    white-space: normal;
    word-wrap: break-word;
    ${size.height.auto}

    &:hover {
      background-color: ${colors.neutral.black};
      color: ${colors.neutral.white};
    }

    &.Mui-selected {
      background-color: ${colors.background.accent};

      &:hover {
        background-color: ${colors.neutral.black};
      }
    }

    /* Bold text within menu items */
    strong {
      ${typography.fontWeight.bold}
    }
  }
`;

export const titleStyles = css`
  ${typography.fontSize['4xl']}
  ${typography.fontWeight.medium}
  ${typography.lineHeight.none}
  ${size.maxWidth.md}
`;

export const fieldsGrid = css`
  ${grid.base}
  ${grid.cols(1)}
  ${spacing.gap.l}

  ${breakpoints.md} {
    ${grid.cols(2)}
  }

  /* Prevent grid items from overflowing */
  > * {
    ${size.minWidth.zero}
    ${overflow.hidden}
  }
`;

export const buttonGroup = css`
  ${flex.columnReverse}
  ${spacing.gap.m}
  ${flex.justify.end}
  ${spacing.padding.top.xl}
  
  ${breakpoints.md} {
    ${flex.row}
    ${spacing.margin.left.auto}
    ${spacing.margin.top.auto}
  }
`;

export const fieldWrapper = css`
  ${flex.column}
  ${spacing.gap.xxs}
`;

export const fieldLabel = css`
  ${typography.fontFamily.mono}
  color: ${colors.text.secondary};
  ${typography.fontSize.xs}
  ${typography.textTransform.uppercase}
`;

export const fullWidthField = css`
  ${grid.item.colSpan(1)}

  ${breakpoints.md} {
    ${grid.item.colSpan(2)}
  }
`;

export const radioGroup = css`
  ${spacing.margin.top.xl}
  ${flex.row}

  /* Radio button customization */
  .MuiRadio-root {
    /* Checked state - black color */
    &.Mui-checked {
      color: ${colors.neutral.black};
    }
  }
`;

export const infoMessage = css`
  ${spacing.margin.top.l}
  ${typography.fontFamily.mono}
  ${typography.fontWeight.medium}
  ${typography.fontSize.sm}
  color: ${colors.neutral.black};
`;

export const checkboxWrapper = css`
  /* Checkbox button customization */
  .MuiCheckbox-root {
    color: ${colors.neutral.black};

    /* Checked state */
    &.Mui-checked {
      color: ${colors.neutral.black};
    }
  }

  /* Checkbox label typography */
  .MuiFormControlLabel-label {
    ${typography.fontSize.sm}
    ${typography.fontWeight.medium}
    color: ${colors.neutral.black};
  }
`;

export const checkboxError = css`
  /* Error state checkbox - higher specificity to override default colors */
  &.MuiCheckbox-root {
    color: ${colors.semantic.error};

    &.Mui-checked {
      color: ${colors.semantic.error};
    }
  }
`;

export const captchaContainer = css`
  ${spacing.margin.top.xl}

  /* Center hCaptcha iframe */
  > div {
    ${flex.base}
  }
`;

export const errorContainer = css`
  ${spacing.padding.x.m}
  ${spacing.padding.y.m}
  ${spacing.margin.top.l}
  background-color: ${colors.semantic.errorLight}10;
  ${borders.all}
  border-color: ${colors.semantic.error};
  ${borders.radius.base}
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  color: ${colors.semantic.error};
  text-align: center;
`;

export const loadingContainer = css`
  ${flex.center}
  ${flex.column}
  ${spacing.gap.m}
  ${spacing.padding.x.xl}
  ${spacing.padding.y.xl}
`;

export const loadingText = css`
  ${typography.fontSize.sm}
  ${typography.fontWeight.medium}
  color: ${colors.text.secondary};
`;

export const iconWrapper = css`
  ${position.relative}
  ${flex.center}
  width: ${spacingValues.xxxl};
  height: ${spacingValues.m};

  svg {
    ${position.absolute}
    ${position.inset.centered}
  }
`;
