// utils/dynamicImports.ts
export const ServiceModules = {
  booking: () => import('@/services/booking'),
  education: () => import('@/services/education'),
  healthcare: () => import('@/services/healthcare'),
  // Add more services as needed
};

export async function loadServiceModule(serviceName: keyof typeof ServiceModules) {
  try {
    const module = await ServiceModules[serviceName]();
    return module.default;
  } catch (error) {
    console.error(`Failed to load ${serviceName} module:`, error);
    throw error;
  }
}