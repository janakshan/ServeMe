// services/api/services.ts
import { Service } from '../../utils/types';

const API_BASE_URL = 'https://your-api-endpoint.com/api';

// Mock data for development - replace with real API calls
const MOCK_SERVICES: Service[] = [
  // Main app services with full implementations (prioritized)
  {
    id: '1',
    name: 'Education',
    type: 'education',
    description: 'Online courses and learning',
    shortDescription: 'Learn new skills online',
    icon: 'https://cdn-icons-png.flaticon.com/128/3749/3749784.png',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/2784/2784403.png',
    color: '#6A1B9A', // Purple theme
    isActive: true,
    features: ['Video courses', 'Certificates', 'Progress tracking'],
    status: 'featured',
    priority: 'high',
    rating: 4.6,
    userCount: 1832,
    category: 'digital',
  },
  {
    id: '2',
    name: 'Booking',
    type: 'booking',
    description: 'Professional appointment booking services',
    shortDescription: 'Book appointments easily',
    icon: 'https://cdn-icons-png.flaticon.com/128/2693/2693507.png',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/2693/2693507.png',
    color: '#0D47A1', // Blue theme
    isActive: true,
    features: ['Service booking', 'Calendar integration', 'Reminders'],
    status: 'featured',
    priority: 'high',
    rating: 4.7,
    userCount: 2145,
    category: 'professional',
  },
  {
    id: '3',
    name: 'Healthcare',
    type: 'healthcare',
    description: 'Medical consultations and health services',
    shortDescription: 'Healthcare at your fingertips',
    icon: 'https://cdn-icons-png.flaticon.com/128/2382/2382533.png',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/2382/2382533.png',
    color: '#2E7D32', // Green theme
    isActive: true,
    features: ['Consultations', 'Prescriptions', 'Health records'],
    status: 'featured',
    priority: 'high',
    rating: 4.8,
    userCount: 1967,
    category: 'healthcare',
  },
  {
    id: '4',
    name: 'Entertainment',
    type: 'entertainment',
    description: 'Movies, events, and entertainment booking',
    shortDescription: 'Fun and entertainment',
    icon: 'https://cdn-icons-png.flaticon.com/128/3143/3143203.png',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/3143/3143203.png',
    color: '#E91E63', // Pink theme
    isActive: true,
    features: ['Movie tickets', 'Event booking', 'Live shows'],
    status: 'featured',
    priority: 'high',
    rating: 4.5,
    userCount: 3251,
    category: 'entertainment',
  },
  // Additional services (coming soon implementations)
  {
    id: '5',
    name: 'Men Saloon',
    type: 'men_saloon',
    description: 'Professional men\'s grooming services',
    shortDescription: 'Hair, beard & styling',
    icon: 'https://cdn-icons-png.flaticon.com/128/3163/3163478.png',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/3163/3163478.png',
    color: '#FF69B4',
    isActive: true,
    features: ['Hair cutting', 'Beard trimming', 'Face treatments'],
    status: 'popular',
    priority: 'medium',
    rating: 4.5,
    userCount: 1287,
    category: 'wellness',
  },
  {
    id: '6',
    name: 'Vehicle Repair',
    type: 'vehicle_repair',
    description: 'Professional vehicle maintenance and repair',
    shortDescription: 'Auto repair & maintenance',
    icon: 'https://cdn-icons-png.flaticon.com/128/2092/2092063.png',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1995/1995515.png',
    color: '#FF9500',
    isActive: true,
    features: ['Engine repair', 'Oil change', 'Tire service'],
    status: 'available',
    priority: 'medium',
    rating: 4.7,
    userCount: 892,
    category: 'automotive',
  },
  {
    id: '7',
    name: 'Cleaning',
    type: 'cleaning',
    description: 'Professional cleaning services',
    shortDescription: 'Home & office cleaning',
    icon: 'https://cdn-icons-png.flaticon.com/128/2092/2092990.png',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/2092/2092990.png',
    color: '#32CD32',
    isActive: true,
    features: ['House cleaning', 'Office cleaning', 'Deep cleaning'],
    status: 'popular',
    priority: 'medium',
    rating: 4.6,
    userCount: 1543,
    category: 'professional',
  },
  {
    id: '8',
    name: 'Parcel',
    type: 'parcel',
    description: 'Fast and reliable parcel delivery service',
    shortDescription: 'Send & receive parcels',
    icon: 'https://cdn-icons-png.flaticon.com/128/2092/2092990.png',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/2092/2092990.png',
    color: '#FF6B35',
    isActive: true,
    features: ['Same day delivery', 'Package tracking', 'Secure delivery'],
    status: 'featured',
    priority: 'medium',
    rating: 4.8,
    userCount: 2156,
    category: 'logistics',
  },
  {
    id: '9',
    name: 'Food Delivery',
    type: 'food_delivery',
    description: 'Order food from your favorite restaurants',
    shortDescription: 'Order food online',
    icon: 'https://cdn-icons-png.flaticon.com/128/2092/2092990.png',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/2092/2092990.png',
    color: '#FF3B30',
    isActive: true,
    features: ['Restaurant orders', 'Live tracking', 'Quick delivery'],
    status: 'popular',
    priority: 'medium',
    rating: 4.7,
    userCount: 3428,
    category: 'food',
  },
];

export const servicesApi = {
  async getServices(): Promise<Service[]> {
    try {
      // For development, return mock data
      // Replace with actual API call:
      // const response = await fetch(`${API_BASE_URL}/services`);
      // if (!response.ok) {
      //   throw new Error('Failed to fetch services');
      // }
      // return response.json();

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return MOCK_SERVICES;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  },

  async getServiceDetails(serviceId: string): Promise<Service> {
    try {
      // For development, return mock data
      const service = MOCK_SERVICES.find(s => s.id === serviceId);
      if (!service) {
        throw new Error('Service not found');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return service;

      // Replace with actual API call:
      // const response = await fetch(`${API_BASE_URL}/services/${serviceId}`);
      // if (!response.ok) {
      //   throw new Error('Failed to fetch service details');
      // }
      // return response.json();
    } catch (error) {
      console.error('Error fetching service details:', error);
      throw error;
    }
  },

  async updateServiceStatus(serviceId: string, isActive: boolean): Promise<void> {
    try {
      // For development, just log the action
      console.log(`Service ${serviceId} status updated to: ${isActive}`);
      
      // Replace with actual API call:
      // const response = await fetch(`${API_BASE_URL}/services/${serviceId}/status`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ isActive }),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to update service status');
      // }
    } catch (error) {
      console.error('Error updating service status:', error);
      throw error;
    }
  },
};