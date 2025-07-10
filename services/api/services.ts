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
    icon: '📅',
    color: '#007AFF',
    isActive: true,
    features: ['Restaurant booking', 'Hotel reservation', 'Event tickets'],
  },
  {
    id: '2',
    name: 'Education',
    type: 'education',
    description: 'Online courses and learning',
    icon: '📚',
    color: '#5856D6',
    isActive: true,
    features: ['Video courses', 'Certificates', 'Progress tracking'],
  },
  {
    id: '3',
    name: 'Healthcare',
    type: 'healthcare',
    description: 'Doctor appointments and health services',
    icon: '🏥',
    color: '#34C759',
    isActive: true,
    features: ['Doctor booking', 'Health records', 'Telemedicine'],
  },
  {
    id: '4',
    name: 'Entertainment',
    type: 'entertainment',
    description: 'Movies, events, and entertainment',
    icon: '🎬',
    color: '#FF9500',
    isActive: true,
    features: ['Movie tickets', 'Event booking', 'Concert tickets'],
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