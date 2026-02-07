/** @jsxImportSource @emotion/react */
'use client';

import { createContext, useContext } from 'react';

interface CooperationModalContextType {
  openCooperationModal: () => void;
}

export const CooperationModalContext = createContext<CooperationModalContextType | undefined>(
  undefined
);

export function useCooperationModal() {
  const context = useContext(CooperationModalContext);
  if (context === undefined) {
    throw new Error('useCooperationModal must be used within a PlatformLayout');
  }
  return context;
}

