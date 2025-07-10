// utils/types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  type: 'booking' | 'education' | 'healthcare' | 'entertainment';
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  features: string[];
}

export interface NavigationState {
  currentService?: string;
  previousRoute?: string;
}