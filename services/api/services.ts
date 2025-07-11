// services/api/services.ts
import { Service } from '../../utils/types';

const API_BASE_URL = 'https://your-api-endpoint.com/api';

// Mock data for development - replace with real API calls
const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Booking',
    type: 'booking',
    description: 'Book restaurants, hotels, and more',
    shortDescription: 'Reserve tables & rooms',
    icon: 'https://cdn-icons-png.flaticon.com/128/2693/2693507.png',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1170/1170576.png',
    color: '#007AFF',
    isActive: true,
    features: ['Restaurant booking', 'Hotel reservation', 'Event tickets'],
    status: 'featured',
    priority: 'high',
    rating: 4.8,
    userCount: 2547,
    category: 'lifestyle',
  },
  {
    id: '2',
    name: 'Education',
    type: 'education',
    description: 'Online courses and learning',
    shortDescription: 'Learn new skills online',
    icon: 'https://cdn-icons-png.flaticon.com/128/3749/3749784.png',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/2784/2784403.png',
    color: '#5856D6',
    isActive: true,
    features: ['Video courses', 'Certificates', 'Progress tracking'],
    status: 'coming_soon',
    priority: 'medium',
    rating: 4.6,
    userCount: 1832,
    category: 'digital',
  },
  {
    id: '3',
    name: 'Healthcare',
    type: 'healthcare',
    description: 'Doctor appointments and health services',
    shortDescription: 'Book medical appointments',
    icon: 'https://cdn-icons-png.flaticon.com/128/2382/2382533.png',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/2382/2382533.png',
    color: '#34C759',
    isActive: true,
    features: ['Doctor booking', 'Health records', 'Telemedicine'],
    status: 'popular',
    priority: 'high',
    rating: 4.9,
    userCount: 3241,
    category: 'wellness',
  },
  {
    id: '4',
    name: 'Entertainment',
    type: 'entertainment',
    description: 'Movies, events, and entertainment',
    shortDescription: 'Book shows & events',
    icon: 'https://cdn-icons-png.flaticon.com/128/2991/2991148.png',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/777/777242.png',
    color: '#FF9500',
    isActive: true,
    features: ['Movie tickets', 'Event booking', 'Concert tickets'],
    status: 'available',
    priority: 'medium',
    rating: 4.5,
    userCount: 1965,
    category: 'lifestyle',
  },
  {
    id: '5',
    name: 'Carpenter',
    type: 'carpenter',
    description: 'Professional carpentry and woodwork services',
    shortDescription: 'Expert woodwork & repairs',
    icon: 'https://cdn-icons-png.flaticon.com/128/2092/2092063.png',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1995/1995515.png',
    color: '#8B4513',
    isActive: true,
    features: ['Furniture repair', 'Custom woodwork', 'Home renovations'],
    status: 'available',
    priority: 'medium',
    rating: 4.7,
    userCount: 892,
    category: 'professional',
  },
  {
    id: '6',
    name: 'Cleaner',
    type: 'cleaner',
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
    id: '7',
    name: 'Painter',
    type: 'painter',
    description: 'Interior and exterior painting services',
    shortDescription: 'Professional painting',
    icon: 'https://cdn-icons-png.flaticon.com/128/2742/2742277.png',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/1995/1995567.png',
    color: '#FF6347',
    isActive: true,
    features: ['Interior painting', 'Exterior painting', 'Color consultation'],
    status: 'available',
    priority: 'low',
    rating: 4.4,
    userCount: 678,
    category: 'professional',
  },
  {
    id: '8',
    name: 'Electrician',
    type: 'electrician',
    description: 'Electrical installation and repair services',
    shortDescription: 'Electrical repairs & install',
    icon: 'https://cdn-icons-png.flaticon.com/128/2092/2092573.png',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/2092/2092573.png',
    color: '#FFD700',
    isActive: true,
    features: ['Wiring installation', 'Electrical repairs', 'Safety inspections'],
    status: 'new',
    priority: 'medium',
    rating: 4.8,
    userCount: 421,
    category: 'professional',
  },
  {
    id: '9',
    name: 'Beauty',
    type: 'beauty',
    description: 'Beauty and wellness services',
    shortDescription: 'Hair, makeup & nails',
    icon: 'https://cdn-icons-png.flaticon.com/128/3163/3163478.png',
    imageUrl: 'https://cdn-icons-png.flaticon.com/512/3163/3163478.png',
    color: '#FF69B4',
    isActive: true,
    features: ['Hair styling', 'Makeup services', 'Nail care'],
    status: 'available',
    priority: 'medium',
    rating: 4.5,
    userCount: 1287,
    category: 'wellness',
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
      await new Promise(resolve => setTimeout(resolve, 1000));
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