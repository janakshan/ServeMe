// hooks/useServiceLoader.ts
import { useState, useEffect } from 'react';
import { router } from 'expo-router';

export function useServiceLoader(serviceId: string) {
  const [isLoading, setIsLoading] = useState(true);
  const [serviceConfig, setServiceConfig] = useState(null);

  useEffect(() => {
    loadServiceConfiguration(serviceId);
  }, [serviceId]);

  const loadServiceConfiguration = async (id: string) => {
    setIsLoading(true);
    try {
      // Dynamic import based on service type
      const config = await import(`@/services/configs/${id}.config.ts`);
      setServiceConfig(config.default);
    } catch (error) {
      console.error('Failed to load service configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToService = (serviceId: string) => {
    router.push(`/(services)/${serviceId}/(tabs)` as any);
  };

  return { isLoading, serviceConfig, navigateToService };
}