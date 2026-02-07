/** @jsxImportSource @emotion/react */
'use client';

import { Interpolation, Theme } from '@emotion/react';
import React, { forwardRef } from 'react';
import CardContainer from './CardContainer';
import CardHeader, { CardHeaderProps } from './CardHeader';

export interface CardProps extends Omit<CardHeaderProps, 'children' | 'title' | 'css'> {
  /**
   * Card id attribute
   */
  id?: string;
  /**
   * Card title (required if showHeader is true)
   */
  title?: string | null;
  /**
   * Content to be displayed in the card
   */
  children?: React.ReactNode;
  /**
   * Whether to show the header
   * @default true
   */
  showHeader?: boolean;
  /**
   * Custom CSS for the container
   */
  css?: Interpolation<Theme>;
  style?: React.CSSProperties;
  animate?: boolean;
}

/**
 * Card component - Complete card with header and container
 * Combines CardHeader and CardContainer for a complete card structure
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      // Card props
      children,
      showHeader = true,
      // CardHeader props
      title,
      icon,
      tooltip,
      tooltipIcon,
      titleType,
      titleCss,
      iconCss,
      tooltipIconCss,
      rightContent,
      rightContentProps,
      animate = true,
      ...props
    },
    ref: React.Ref<HTMLDivElement>
  ) => {
    return (
      <CardContainer animate={animate} ref={ref} {...props}>
        {showHeader && title && (
          <CardHeader
            title={title}
            icon={icon}
            tooltip={tooltip}
            tooltipIcon={tooltipIcon}
            titleType={titleType}
            titleCss={titleCss}
            iconCss={iconCss}
            tooltipIconCss={tooltipIconCss}
            rightContent={rightContent}
            rightContentProps={rightContentProps}
          />
        )}
        {children}
      </CardContainer>
    );
  }
);

Card.displayName = 'Card';

export default Card;
