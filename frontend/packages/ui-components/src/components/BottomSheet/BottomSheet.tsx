/** @jsxImportSource @emotion/react */
'use client';

import React, { useEffect } from 'react';
import { Modal } from '@mui/material';
import { motion, AnimatePresence } from 'motion/react';
import * as styles from './BottomSheet.styles';
import { Icon } from '../Icon';

const MotionDiv = motion.div;

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const BackdropSlot = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  function BackdropSlot(props, ref) {
    const {
      onDrag,
      onDragStart,
      onDragEnd,
      onDragEnter,
      onDragExit,
      onDragLeave,
      onDragOver,
      onAnimationStart,
      onAnimationEnd,
      onAnimationIteration,
      ...motionProps
    } = props;
    return (
      <MotionDiv
        ref={ref}
        css={styles.backdrop}
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        {...motionProps}
      />
    );
  }
);

export interface BottomSheetProps {
  /**
   * Controls whether the bottom sheet is open or closed
   */
  open: boolean;
  
  /**
   * Callback function called when the bottom sheet should close
   */
  onClose: () => void;
  
  /**
   * Bottom sheet title
   */
  title?: string;
  
  /**
   * Custom header content (overrides title if provided)
   */
  header?: React.ReactNode;
  
  /**
   * Content to render inside the bottom sheet
   */
  children: React.ReactNode;
  
  /**
   * Accessible label for the close button
   * @default 'Close'
   */
  ariaCloseLabel?: string;
}

const sheetVariants = {
  hidden: { 
    y: '100%',
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1] as const,
    },
  },
  visible: {
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0, 0, 0.2, 1] as const,
    },
  },
};

/**
 * BottomSheet - A mobile-friendly modal that slides up from the bottom
 * 
 * @example
 * ```tsx
 * <BottomSheet
 *   open={open}
 *   onClose={() => setOpen(false)}
 *   title="Sort by"
 * >
 *   <YourContent />
 * </BottomSheet>
 * ```
 */
export default function BottomSheet({
  open,
  onClose,
  title,
  header,
  children,
  ariaCloseLabel = 'Close',
}: BottomSheetProps) {
  
  // Prevent body scroll when bottom sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence mode="wait">
      {open && (
        <Modal
          open={open}
          onClose={onClose}
          css={styles.modalContainer}
          disableScrollLock={true}
          slots={{
            backdrop: BackdropSlot,
          }}
          slotProps={{
            backdrop: {
              onClick: onClose,
            },
          }}
        >
          <MotionDiv
            css={styles.sheetContainer}
            variants={sheetVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div css={styles.sheet}>
              {/* Header */}
              <div css={styles.header}>
                {header ? (
                  header
                ) : (
                  <>
                    {title && <h2 css={styles.title}>{title}</h2>}
                    <button
                      css={styles.closeButton}
                      onClick={onClose}
                      aria-label={ariaCloseLabel}
                    >
                      <Icon name="close" />
                    </button>
                  </>
                )}
              </div>
              
              {/* Content */}
              <div css={styles.content}>
                {children}
              </div>
            </div>
          </MotionDiv>
        </Modal>
      )}
    </AnimatePresence>
  );
}

