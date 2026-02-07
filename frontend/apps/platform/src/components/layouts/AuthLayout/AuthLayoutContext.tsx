/** @jsxImportSource @emotion/react */
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthLayoutContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AuthLayoutContext = createContext<AuthLayoutContextType | undefined>(
  undefined
);

export function AuthLayoutProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AuthLayoutContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </AuthLayoutContext.Provider>
  );
}

export function useAuthLayout() {
  const context = useContext(AuthLayoutContext);
  if (context === undefined) {
    throw new Error('useAuthLayout must be used within an AuthLayoutProvider');
  }
  return context;
}
