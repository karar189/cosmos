/** @jsxImportSource @emotion/react */
'use client';

import { Interpolation, Theme } from '@emotion/react';
import { Tab as MuiTab, TabProps as MuiTabProps } from '@mui/material';
import * as styles from './Tabs.styles';

export interface TabProps extends MuiTabProps {
  css?: Interpolation<Theme>;
}

/**
 * Tab component - Wrapper around MUI Tab with consistent styling
 *
 * Individual tab item used within the Tabs component.
 * Each tab can be clicked to switch between different views or sections.
 */
export default function Tab({ css, ...muiProps }: TabProps) {
  return <MuiTab css={[styles.tab, css]} {...muiProps} />;
}
