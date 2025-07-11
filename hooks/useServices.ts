// hooks/useServices.ts
import { useState, useEffect } from 'react';
import { Service } from '../utils/types';
import { servicesApi } from '../services/api/services';

let cachedServices: Service[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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
    // Check if we have cached data that's still valid
    const now = Date.now();
    if (cachedServices && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      setServices(cachedServices);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const servicesData = await servicesApi.getServices();
      setServices(servicesData);
      
      // Cache the data
      cachedServices = servicesData;
      cacheTimestamp = now;
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