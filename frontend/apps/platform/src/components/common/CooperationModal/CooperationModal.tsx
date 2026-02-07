/** @jsxImportSource @emotion/react */
'use client';

import PlatformModal from '../PlatformModal/PlatformModal';

interface CooperationModalProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function CooperationModal({ open, onClose, children }: CooperationModalProps) {
  return (
    <PlatformModal
      open={open}
      onClose={onClose}
      ariaLabelledBy="cooperation-modal-title"
      ariaDescribedBy="cooperation-modal-description"
    >
      {children}
    </PlatformModal>
  );
}
