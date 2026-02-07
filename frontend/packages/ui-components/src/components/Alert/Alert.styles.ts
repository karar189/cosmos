import { css } from '@emotion/react';
import {
  borders,
  colors,
  flex,
  spacing,
  typography,
} from '../../theme/styleSystem';

export type AlertSeverity = 'warning' | 'info' | 'error' | 'success';

/**
 * Get alert background and text colors based on severity
 */
export const getAlertStyles = (severity: AlertSeverity) => {
  const colorScheme = colors.alert[severity];

  return css`
    ${flex.row}
    ${flex.align.center}
    ${spacing.padding.y.s}
    ${spacing.padding.x.sm}
    ${borders.radius.lg}
    background-color: ${colorScheme.background};
    color: ${colorScheme.text};
    ${typography.fontFamily.primary}
    ${typography.fontSize.sm}
    ${typography.fontWeight.medium}
    ${typography.lineHeight.relaxed}
  `;
};

export const alertIcon = css`
  ${flex.item.shrink0}
  ${spacing.margin.right.s}
`;

export const alertContent = css`
  ${flex.one}
`;

/**
 * MUI Alert wrapper - makes MUI Alert transparent and inherit parent styles
 */
export const muiAlertWrapper = {
  padding: 0,
  backgroundColor: 'transparent',
  color: 'inherit',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: 'inherit',
  lineHeight: 'inherit',
  '& .MuiAlert-message': {
    padding: 0,
    width: '100%',
  },
};

