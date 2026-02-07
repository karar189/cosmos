import {
  flex,
  spacing,
  typography,
  colors,
  position,
  transitions,
  coloring,
  size,
  borders,
  cursor,
  spacingValues,
} from '../../theme/styleSystem';
import { css } from '@emotion/react';
  
  export const stepperHorizontal = css`
    ${flex.row}
    ${flex.align.center}
    ${size.width.full}
    ${spacing.margin.left.xxl}
  `;
  
export const stepperHorizontalAlt = css`
    ${flex.row}
    ${flex.justify.between}
    ${size.width.full}
`;
  
export const stepWrapperHorizontal = css`
    ${flex.row}
    ${flex.align.center}
    ${flex.one}
    ${position.relative}
    min-width: 0;
    justify-content: flex-start;
  `;
  
  export const stepWrapperHorizontalAlt = css`
    ${flex.column}
    ${flex.align.center}
    ${flex.one}
    ${position.relative}
  `;
  
  export const stepContainerHorizontal = css`
  ${flex.row}
  ${flex.align.center}
  ${spacing.gap.xs}
  ${position.relative}
  flex-shrink: 0;
`;
  
  export const stepContainerHorizontalAlt = css`
    ${flex.column}
    ${flex.align.center}
    ${spacing.gap.xs}
    ${position.relative}
  `;
  
  export const stepIconWrapper = css`
    ${flex.center}
    ${position.relative}
    ${position.zIndex.base}
  `;
  
  export const stepClickable = css`
    ${cursor.pointer}
    
    &:hover {
      opacity: 0.8;
    }
  `;
  
  // Step Icon
  export const stepIcon = css`
    ${flex.center}
    ${size.width.custom('32px')}
    ${size.height.custom('32px')}
    ${borders.radius.circle}
    ${typography.fontSize.base}
    ${typography.fontWeight.medium}
    ${typography.fontFamily.primary}
    ${transitions.all}
    ${transitions.duration.slow}
`;
  
export const stepIconActive = css`
    ${coloring.background.neutral.dark}
    ${coloring.text.neutral.white}
    border: 2px solid ${colors.neutral.black};
`;

export const stepIconCompleted = css`
    ${coloring.background.neutral.dark}
    ${coloring.text.neutral.white}
    border: 2px solid ${colors.neutral.black};
`;

export const stepIconInactive = css`
    ${coloring.background.transparent}
    color: ${colors.text.secondary};
    border: 2px solid ${colors.neutral.gray300};
    opacity: 1;
`;
  
  export const stepNumber = css`
    ${typography.lineHeight.none}
  `;
  
  export const checkmark = css`
    ${typography.lineHeight.none}
    ${typography.fontSize.base}
  `;
  
  export const stepLabel = css`
    ${flex.column}
    ${spacing.gap.xxs}
  `;
  
  export const stepLabelAlt = css`
    ${flex.column}
    ${flex.align.center}
    ${spacing.gap.xxs}
    ${typography.textAlign.center}
    ${spacing.margin.top.xs}
  `;
  
  export const stepLabelText = css`
    ${typography.fontSize.sm};
    ${typography.fontWeight.normal};
    ${typography.fontFamily.primary};
    transition: color 0.3s ease;
  `;
  
  export const stepLabelActive = css`
    ${coloring.text.primary};
    ${typography.fontWeight.medium};
  `;
  
  export const stepLabelInactive = css`
    color: ${colors.text.secondary};
    opacity: 1;
  `;
  
  export const stepOptional = css`
    ${typography.fontSize.xs};
    ${typography.fontWeight.normal};
    ${coloring.text.secondary};
  `;
  
  export const stepDescription = css`
    ${typography.fontSize.xs};
    ${typography.fontWeight.normal};
    ${coloring.text.secondary};
    ${spacing.margin.top.xxs}
    ${size.maxWidth.sm};
  `;
  
export const connectorHorizontal = css`
    ${flex.one}
    ${size.height.custom('2px')}
    background-color: ${colors.neutral.gray300};
    margin: 0 ${spacing.gap.m};
    ${transitions.colors}
    ${transitions.duration.slow}
    flex-shrink: 1;
    min-width: 0;
`;

export const connectorHorizontalAlt = css`
    ${position.absolute}
    top: ${spacingValues.m};
    left: calc(50% + ${spacingValues.l});
    right: calc(-50% + ${spacingValues.l});
    ${size.height.custom('2px')}
    background-color: ${colors.neutral.gray300};
    ${transitions.colors}
    ${transitions.duration.slow}
`;

export const connectorCompleted = css`
    ${coloring.background.neutral.dark};
`;