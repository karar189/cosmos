/** @jsxImportSource @emotion/react */
'use client';

import React from 'react';
import { BaseModal, Icon } from '@core3/ui-components';
import * as styles from './PlatformModal.styles';

export interface PlatformModalProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

/**
 * PlatformModal - A preconfigured modal component for the platform app
 * 
 * This component wraps BaseModal with platform-specific defaults:
 * - Default close icon (✕)
 * - Backdrop blur and opacity styling
 * - Centered layout with standard sizing
 * - Standard animation and positioning
 * 
 * @example
 * ```tsx
 * <PlatformModal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   ariaLabelledBy="modal-title"
 * >
 *   <div>Modal content</div>
 * </PlatformModal>
 * ```
 */
export default function PlatformModal({
  open,
  onClose,
  children,
  ariaLabelledBy = 'modal-title',
  ariaDescribedBy = 'modal-description',
}: PlatformModalProps) {
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      ariaLabelledBy={ariaLabelledBy}
      ariaDescribedBy={ariaDescribedBy}
      containerCss={styles.modalContainer}
      boxCss={styles.modalBox}
      closeIcon={<Icon name="close" />}
    >
      {children}
    </BaseModal>
  );
}

