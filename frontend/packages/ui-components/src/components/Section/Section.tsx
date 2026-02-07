/** @jsxImportSource @emotion/react */
'use client';

import { Interpolation, Theme } from '@emotion/react';
import React from 'react';
import SectionContainer from './SectionContainer';
import SectionGrid, { SectionGridProps } from './SectionGrid';
import SectionHeader, { SectionHeaderProps } from './SectionHeader';
export interface SectionProps
  extends Omit<SectionHeaderProps, 'children' | 'title' | 'content'>,
    Omit<SectionGridProps, 'children' | 'id'> {
  /**
   * Section id attribute
   */
  id?: string;
  /**
   * Section title (required if showHeader is true)
   */
  title?: string;
  /**
   * Content to be displayed in the grid
   */
  children?: React.ReactNode;
  /**
   * Whether to show the header
   * @default true
   */
  showHeader?: boolean;
  /**
   * Content to be displayed in the header
   */
  headerContent?: React.ReactNode;
  /**
   * Custom CSS for the container
   */
  css?: Interpolation<Theme>;
  style?: React.CSSProperties;
}

/**
 * Section component - Complete section with header and grid layout
 * Combines SectionHeader and SectionGrid for a complete section structure
 */
export default function Section({
  // SectionHeader props
  icon,
  iconName,
  title,
  headerContent,
  // SectionGrid props
  columns,
  rows,
  areas,
  gap,
  autoFit,
  autoFill,
  // Section props
  children,
  showHeader = true,
  ...props
}: SectionProps) {
  return (
    <SectionContainer {...props}>
      {showHeader && title && (
        <SectionHeader icon={icon} iconName={iconName} title={title} content={headerContent} />
      )}
      <SectionGrid
        columns={columns}
        rows={rows}
        areas={areas}
        gap={gap}
        autoFit={autoFit}
        autoFill={autoFill}
      >
        {children}
      </SectionGrid>
    </SectionContainer>
  );
}
