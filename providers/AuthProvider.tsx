// providers/AuthProvider.tsx - FIXED VERSION (no circular dependency)
import React, { ReactNode } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useAuthState } from '../hooks/useAuthState';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const authState = useAuthState();

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}