/** @jsxImportSource @emotion/react */
'use client';

import { Interpolation, Theme } from '@emotion/react';
import React from 'react';
import * as styles from './Tabs.styles';

export interface TabPanelProps {
  value: string | number;
  index: string | number;
  children?: React.ReactNode;
  css?: Interpolation<Theme>;
  id?: string;
  'aria-labelledby'?: string;
}

/**
 * TabPanel component - Container for tab content with consistent styling
 *
 * Container for tab content that is conditionally displayed based on the active tab value.
 * Only the panel matching the current tab value will be visible.
 *
 * @example
 * <TabPanel value={activeTab} index="tab1">
 *   Content for tab 1
 * </TabPanel>
 */
export default function TabPanel({
  value,
  index,
  children,
  css,
  id,
  'aria-labelledby': ariaLabelledBy,
}: TabPanelProps) {
  const hidden = value !== index;

  return (
    <div
      role="tabpanel"
      hidden={hidden}
      id={id || `tabpanel-${index}`}
      aria-labelledby={ariaLabelledBy || `tab-${index}`}
      css={[styles.tabPanel, css]}
    >
      {!hidden && children}
    </div>
  );
}
