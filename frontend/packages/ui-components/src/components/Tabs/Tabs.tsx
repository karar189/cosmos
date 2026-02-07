/** @jsxImportSource @emotion/react */
'use client';

import { Interpolation, Theme } from '@emotion/react';
import { Tabs as MuiTabs, TabsProps as MuiTabsProps } from '@mui/material';
import * as styles from './Tabs.styles';

export interface TabsProps extends MuiTabsProps {
  css?: Interpolation<Theme>;
}

/**
 * Tabs component - Wrapper around MUI Tabs with consistent styling
 *
 * Provides a tabbed interface for organizing content into multiple panels.
 * Each tab can be clicked to switch between different views or sections.
 */
export default function Tabs({ children, value, onChange, css, ...muiProps }: TabsProps) {
  return (
    <MuiTabs 
      value={value} 
      onChange={onChange} 
      css={[styles.tabs, css]} 
      variant="scrollable"
      scrollButtons={false}
      {...muiProps}
    >
      {children}
    </MuiTabs>
  );
}
