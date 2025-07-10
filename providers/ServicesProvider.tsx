// providers/ServicesProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Service } from '@/utils/types';
import { servicesApi } from '@/services/api/services';

interface ServicesContextType {
  services: Service[];
  isLoading: boolean;
  fetchServices: () => Promise<void>;
  getServiceById: (id: string) => Service | undefined;
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);

export function useServices() {
  const context = useContext(ServicesContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider');
  }
  return context;
}

interface ServicesProviderProps {
  children: ReactNode;
}

export function ServicesProvider({ children }: ServicesProviderProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const servicesData = await servicesApi.getServices();
      setServices(servicesData);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getServiceById = (id: string) => {
    return services.find(service => service.id === id);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const value = {
    services,
    isLoading,
    fetchServices,
    getServiceById,
  };

  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  );
}
