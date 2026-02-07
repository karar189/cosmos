/** @jsxImportSource @emotion/react */
'use client';

import { Interpolation, Theme } from '@emotion/react';
import { Icon, IconName } from '../Icon';
import * as styles from './TooltipIcon.styles';

export interface TooltipIconProps {
  icon?: IconName;
  css?: Interpolation<Theme>;
}

/**
 * TooltipIcon component - Displays a tooltip icon with MUI Tooltip wrapper
 */
const TooltipIcon: React.FC<TooltipIconProps> = ({ icon = 'info', css }) => {
  return <Icon css={[styles.tooltipIcon, css]} name={icon} />;
};

export default TooltipIcon;
