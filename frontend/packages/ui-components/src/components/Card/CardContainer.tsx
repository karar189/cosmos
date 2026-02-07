/** @jsxImportSource @emotion/react */
'use client';

import { Interpolation, Theme } from '@emotion/react';
import { motion } from 'motion/react';
import React, { forwardRef } from 'react';
import * as styles from './CardContainer.styles';

export interface CardContainerProps {
  children?: React.ReactNode;
  id?: string;
  css?: Interpolation<Theme>;
  style?: React.CSSProperties;
  animate?: boolean;
  /**
   * Padding size variant
   * - 'm': 16px padding (default)
   * - 'l': 24px padding
   * @default 'm'
   */
  paddingSize?: 'm' | 'l';
}

/**
 * CardContainer component - Basic container wrapper for card content
 * This is a secondary component for cases where you need just the styled wrapper
 * without the default CardHeader structure.
 */
const CardContainer = forwardRef<HTMLDivElement, CardContainerProps>(
  ({ children, id, style, animate = false, paddingSize = 'm', ...props }, ref) => {
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    };
    const containerStyle = paddingSize === 'l' ? styles.cardContainerLargePadding : styles.cardContainer;
    
    if (animate) {
      return (
        <motion.div
          id={id}
          css={containerStyle}
          style={style}
          {...props}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {children}
        </motion.div>
      );
    }
    return (
      <div id={id} css={containerStyle} style={style} ref={ref} {...props}>
        {children}
      </div>
    );
  }
);

CardContainer.displayName = 'CardContainer';

export default CardContainer;
