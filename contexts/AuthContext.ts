// contexts/AuthContext.ts - CREATE THIS NEW FILE to fix circular dependency
import { createContext } from 'react';

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
