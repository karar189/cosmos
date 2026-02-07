import {
    flex,
    spacing,
    typography,
    colors,
    size,
    coloring,
    cursor,
    transform,
    borders,
    opacity,
    overflow,
  } from '@core3/ui-components/styleSystem';
  import { css } from '@emotion/react';
  
  export const container = css`
    ${flex.column}
    ${flex.justify.center}
    ${spacing.gap.m};
    ${size.maxWidth.xs}
    ${spacing.margin.zero}
    ${spacing.margin.auto}
  `;
  
  export const headings = css`
    ${flex.column}
    ${spacing.gap.m};
  `;
  
  export const tagWrapper = css`
    ${flex.center}
    ${typography.fontSize.xs};
  `;
  
  export const stepperWrapper = css`
    ${flex.row}
    ${flex.justify.center}
    ${flex.align.center}
    ${size.width.custom('85%')}
    ${spacing.margin.auto}
    ${transform.scale(0.75)}
`;
  
  export const titleSection = css`
    ${flex.column}
    ${spacing.gap.xs};
  `;
  
  export const title = css`
    ${flex.center}
    ${typography.fontSize['3xl']};
    ${typography.fontWeight.medium};
    ${typography.fontFamily.primary};
    ${colors.text.primary};
  `;
  
  export const subtitle = css`
    ${flex.center}
    ${typography.fontSize.sm};
    ${typography.fontWeight.normal};
    ${typography.fontFamily.primary};
    color: ${colors.text.secondary};
    ${typography.textAlign.center};
    ${typography.lineHeight.normal};
  `;
  
  export const instructionsContainer = css`
  ${flex.column}
  ${spacing.gap.s};
  ${spacing.margin.top.m}
  ${spacing.margin.bottom.m}
  ${size.width.full}
  ${size.maxWidth.xs}
  ${spacing.margin.auto}
  ${borders.radius['2xl']};
  ${overflow.hidden}
`;
  
  export const form = css`
    ${flex.column}
    ${spacing.gap.s};
    ${size.width.full}
    ${spacing.margin.top.s}
  `;
  
  export const fieldsContainer = css`
    ${flex.column}
    ${spacing.gap.s};
    ${size.width.full}
    
    input::placeholder {
      ${coloring.background.transparent}
      ${opacity.moderate}
    }
    
    input {
      ${coloring.background.transparent}
    }
  `;
  
  export const submitButton = css`
    ${spacing.margin.top.xs};
    ${size.width.full}
    
    button {
      ${size.width.full}
    }
  `;
  
  export const footer = css`
    ${flex.center}
    ${typography.fontSize.xs};
    ${typography.fontWeight.normal};
    ${typography.fontFamily.primary};
    ${colors.text.secondary};
    ${spacing.margin.top.m};
  `;
  
  export const footerLink = css`
    ${colors.text.primary};
    ${typography.textDecoration.underline}
    ${cursor.pointer}
    
    &:hover {
      ${opacity.higher}
    }
  `;