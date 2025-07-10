// hooks/useServices.ts
import { useState, useEffect } from 'react';
import { Service } from '../utils/types';
import { servicesApi } from '../services/api/services';

interface UseServicesReturn {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
  getServiceById: (id: string) => Service | undefined;
  refreshServices: () => Promise<void>;
}

export function useServices(): UseServicesReturn {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const servicesData = await servicesApi.getServices();
      setServices(servicesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch services';
      setError(errorMessage);
      console.error('Failed to fetch services:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getServiceById = (id: string): Service | undefined => {
    return services.find(service => service.id === id);
  };

  const refreshServices = async () => {
    await fetchServices();
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    isLoading,
    error,
    fetchServices,
    getServiceById,
    refreshServices,
  };
}