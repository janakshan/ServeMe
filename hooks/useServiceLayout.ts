/**
 * DEPRECATED: Use useScopedServiceLayout instead
 * This hook relied on global ServiceThemeContext which has been removed
 * for route-group theme isolation
 */
export function useServiceLayout(serviceType: string) {
  throw new Error(
    'useServiceLayout is deprecated. Use useScopedServiceLayout hooks instead:\n' +
    '- useEducationServiceLayout for education themes\n' +
    '- useBookingServiceLayout for booking themes\n' +
    '- useHealthcareServiceLayout for healthcare themes\n' +
    '- useEntertainmentServiceLayout for entertainment themes'
  );
}