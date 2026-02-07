/** @jsxImportSource @emotion/react */
'use client';

import React from 'react';
import { motion } from 'motion/react';
import * as styles from './Core3Button.styles';
import { Interpolation, Theme } from '@emotion/react';
interface Core3ButtonProps {
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'inverse';
  children?: React.ReactNode;
  animated?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  size?: 'extraSmall' | 'small' | 'medium' | 'large';
  css?: Interpolation<Theme>;
}

const MotionDiv = motion.div;
const MotionButton = motion.button;

export default function Core3Button({
  onClick,
  children = 'JOIN THE WATCHLIST',
  variant = 'primary',
  animated = false,
  disabled = false,
  type = 'button',
  fullWidth = false,
  size = 'medium',
  ...props
}: Core3ButtonProps) {
  return (
    <MotionDiv
      css={[
        styles.buttonWrapper(variant),
        disabled && styles.buttonWrapperDisabled,
        fullWidth && styles.buttonWrapperFullWidth,
      ]}
      whileHover={animated && !disabled ? { scale: 1.05 } : undefined}
      whileTap={animated && !disabled ? { scale: 0.95 } : undefined}
      animate={
        animated && !disabled
          ? {
              scale: [1, 1.02, 1],
            }
          : undefined
      }
      transition={
        animated
          ? {
              scale: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }
          : undefined
      }
    >
      <MotionButton
        type={type}
        css={[
          styles.buttonInner,
          variant === 'secondary' && styles.buttonInnerSecondary,
          variant === 'inverse' && styles.buttonInnerInverse,
          size === 'extraSmall' && styles.buttonInnerExtraSmall,
          size === 'small' && styles.buttonInnerSmall,
          size === 'medium' && null,
          // size === 'large' && styles.buttonInnerLarge,
        ]}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </MotionButton>
    </MotionDiv>
  );
}
