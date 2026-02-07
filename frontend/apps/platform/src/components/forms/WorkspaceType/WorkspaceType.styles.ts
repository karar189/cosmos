import {
    flex,
    spacing,
    typography,
    colors,
    size
  } from '@core3/ui-components/styleSystem';
  import { css } from '@emotion/react';
  
  export const container = css`
    ${flex.column}
    ${flex.justify.center}
    ${spacing.gap.m};
  `;
  
  export const headings = css`
    ${flex.column}
    ${spacing.gap.m};
  `;
  
  export const title = css`
    ${flex.center}
    ${typography.fontSize['3xl']};
    ${typography.fontWeight.medium};
    ${typography.fontFamily.primary};
    color: ${colors.text.primary};
  `;
  
  export const subtitle = css`
    ${flex.center}
    ${typography.fontSize.xs};
    ${typography.fontWeight.normal};
    ${typography.fontFamily.primary};
    color: ${colors.text.secondary};
    ${typography.textAlign.center};
    ${typography.lineHeight.normal};
  `;
  
  export const optionsContainer = css`
    ${flex.column}
    ${spacing.gap.m};
    ${flex.align.center} 
  `;
  
  export const continueButton = css`
  ${spacing.margin.top.m};
  ${size.width.custom('450px')}
  ${spacing.margin.left.auto}
  ${spacing.margin.right.auto}
  
  button {
    ${size.width.full}
  }
`;  

  export const tagsContainer = css`
  ${flex.row}
  ${spacing.gap.xs};
  ${spacing.margin.bottom.xs};
`;

export const tagWrapper = css`
${flex.center}
${typography.fontSize.xs};
`;