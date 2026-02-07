/** @jsxImportSource @emotion/react */
'use client';

import React from 'react';
import { Interpolation, Theme } from '@emotion/react';
import { Alert as MuiAlert } from '@mui/material';
import { Icon, IconName } from '../Icon';
import * as styles from './Alert.styles';
import type { AlertSeverity } from './Alert.styles';

export interface AlertProps {
  /**
   * Alert severity level - controls background and text colors
   * @default 'info'
   */
  severity?: AlertSeverity;
  
  /**
   * Icon name to display on the left side of the alert
   * When provided, icon is shown before the content
   */
  iconName?: IconName;
  
  /**
   * Alert content/message
   */
  children: React.ReactNode;
  
  /**
   * Optional className for additional styling
   */
  className?: string;
  
  /**
   * Custom CSS styles using Emotion
   */
  css?: Interpolation<Theme>;
}

/**
 * Alert Component
 * 
 * A styled alert/notification component for displaying messages with different severity levels.
 * Built on MUI Alert with custom CORE3 styling using the styleSystem.
 * 
 * Features:
 * - Four severity levels: warning, info, error, success
 * - Optional icon support
 * - Responsive design
 * - Full styleSystem integration
 * 
 * @example
 * ```tsx
 * // Warning alert
 * <Alert severity="warning">
 *   This is a warning message
 * </Alert>
 * 
 * // Warning with icon
 * <Alert severity="warning" iconName="info">
 *   Important information with icon
 * </Alert>
 * ```
 */
export default function Alert({
  severity = 'info',
  iconName,
  children,
  className,
  css: customCss,
}: AlertProps) {
  return (
    <div css={[styles.getAlertStyles(severity), customCss]} className={className}>
      <MuiAlert
        severity={severity}
        icon={false}
        sx={styles.muiAlertWrapper}
      >
        {iconName && (
          <div css={styles.alertIcon}>
            <Icon name={iconName} />
          </div>
        )}
        <div css={styles.alertContent}>
          {children}
        </div>
      </MuiAlert>
    </div>
  );
}

