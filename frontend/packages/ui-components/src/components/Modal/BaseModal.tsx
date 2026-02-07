/** @jsxImportSource @emotion/react */
'use client';

import React, { useEffect, useRef } from 'react';
import { Modal, ModalProps } from '@mui/material';
import { motion, AnimatePresence } from 'motion/react';
import { SerializedStyles } from '@emotion/react';
import * as styles from './BaseModal.styles';
import { Icon } from '../Icon';

const MotionDiv = motion.div;

export interface BaseModalProps {
  /**
   * Controls whether the modal is open or closed
   */
  open: boolean;
  
  /**
   * Callback function called when the modal should close
   * (triggered by backdrop click, ESC key, or close button)
   */
  onClose: () => void;
  
  /**
   * Modal variant - controls size and layout behavior
   * - 'default': Centered modal with responsive sizing
   * - 'fullscreen': Full viewport modal with edge padding (24px mobile, 48px desktop)
   * @default 'default'
   */
  variant?: 'default' | 'fullscreen';
  
  /**
   * Modal title - when provided, enables header with title, close button, and separator
   * Works with any variant. Header includes:
   * - Title (24px Aeonik font)
   * - Close button (X icon or custom closeIcon)
   * - Hairline separator (1px light gray)
   * - Padding: 20px vertical, 24px horizontal
   */
  title?: string;
  
  /**
   * Content to render inside the modal
   * For fullscreen variant or when title is provided, content is automatically scrollable
   */
  children?: React.ReactNode;
  
  /**
   * ID of the element that labels the modal (for accessibility)
   * Used for aria-labelledby attribute
   * @default 'modal-title'
   */
  ariaLabelledBy?: string;
  
  /**
   * ID of the element that describes the modal (for accessibility)
   * Used for aria-describedby attribute
   * @default 'modal-description'
   */
  ariaDescribedBy?: string;
  
  /**
   * Accessible label for the close button
   * Should be translated in the consuming component
   * @default 'Close'
   */
  ariaCloseLabel?: string;
  
  /**
   * Custom close icon element
   * - If provided with title: Replaces X icon in header
   * - If provided without title: Renders positioned close button
   * - If undefined: No close button rendered (for default variant without title)
   */
  closeIcon?: React.ReactNode;
  
  /**
   * Custom CSS to apply to the modal container
   * Applied to the backdrop/overlay container element
   */
  containerCss?: SerializedStyles;
  
  /**
   * Custom CSS to apply to the modal box
   * Applied to the main modal content box
   */
  boxCss?: SerializedStyles;
  
  /**
   * Custom CSS to apply to the modal content
   * Applied to the main modal content box
   */
  contentCss?: SerializedStyles;
  
  /**
   * Custom slotProps to pass to underlying MUI Modal component
   * Allows advanced customization of MUI Modal behavior
   */
  slotProps?: ModalProps['slotProps'];
}

const modalVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0, 0, 0.2, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1] as const,
    },
  },
};

export default function BaseModal({
  open,
  onClose,
  children,
  ariaLabelledBy = 'modal-title',
  ariaDescribedBy = 'modal-description',
  ariaCloseLabel = 'Close',
  variant = 'default',
  title,
  containerCss,
  boxCss,
  contentCss,
  slotProps,
  closeIcon,
}: BaseModalProps) {
  const scrollYRef = useRef(0);
  const isFullscreen = variant === 'fullscreen';
  const showHeader = !!title;

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      // Save current scroll position
      scrollYRef.current = window.scrollY;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      // Lock body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      // Delay scroll restoration to allow exit animation to complete
      const timer = setTimeout(() => {
        // Restore body scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';

        // Restore scroll position
        window.scrollTo(0, scrollYRef.current);
      }, 200); // Match the exit animation duration

      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <AnimatePresence mode="wait">
      {open && (
        <Modal
          open={open}
          onClose={onClose}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          css={[styles.modalContainer, containerCss]}
          disableScrollLock={true}
          slotProps={slotProps}
          sx={styles.modalBackdropStyles}
        >
          <MotionDiv
            variants={modalVariants}
            layout
            layoutRoot
            initial="hidden"
            animate="visible"
            exit="exit"
            css={[isFullscreen ? styles.modalBoxFullscreen : styles.modalBox, boxCss]}
          >
            {showHeader ? (
              <>
                <div css={styles.modalHeader}>
                  <h2 css={styles.modalTitle} id={ariaLabelledBy}>
                    {title}
                  </h2>
                  <button
                    css={styles.modalHeaderCloseButton}
                    onClick={onClose}
                    aria-label={ariaCloseLabel}
                  >
                    {closeIcon !== undefined ? closeIcon : <Icon name="close" />}
                  </button>
                </div>
                <div css={[styles.modalContentScrollable, contentCss]}>
                  {children}
                </div>
              </>
            ) : (
              <>
                {closeIcon !== undefined && (
                  <button 
                    css={styles.closeButton} 
                    onClick={onClose} 
                    aria-label={ariaCloseLabel}
                  >
                    {closeIcon}
                  </button>
                )}
                {isFullscreen ? (
                  <div css={[styles.modalContentScrollable, contentCss]}>
                    {children}
                  </div>
                ) : (
                  <div css={contentCss}>
                    {children}
                  </div>
                )}
              </>
            )}
          </MotionDiv>
        </Modal>
      )}
    </AnimatePresence>
  );
}
