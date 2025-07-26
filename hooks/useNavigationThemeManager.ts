/**
 * Navigation theme manager - disabled for route-group theme architecture
 * Theme switching is now handled automatically by route group layouts
 */
export function useNavigationThemeManager() {
  // Route-group themes handle theme switching automatically
  // No global theme management needed
  return {
    currentRoute: null,
    currentTheme: null,
  };
}