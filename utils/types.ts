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
  type: 'education' | 'men_saloon' | 'vehicle_repair' | 'cleaning' | 'parcel' | 'food_delivery';
  description: string;
  shortDescription: string;
  icon: string;
  imageUrl: string;
  color: string;
  isActive: boolean;
  features: string[];
  status: 'available' | 'coming_soon' | 'featured' | 'new' | 'popular';
  priority: 'high' | 'medium' | 'low';
  rating: number;
  userCount: number;
  category: 'professional' | 'lifestyle' | 'wellness' | 'digital' | 'automotive' | 'logistics' | 'food';
}

export interface NavigationState {
  currentService?: string;
  previousRoute?: string;
}