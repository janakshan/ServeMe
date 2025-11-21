import { useNavigationThemeManager } from '@/hooks/useNavigationThemeManager';

/**
 * Component that provides automatic theme management based on navigation
 * Should be included at the root level to ensure proper theme switching
 */
export function NavigationThemeManager() {
  // This hook automatically manages theme switching based on navigation
  useNavigationThemeManager();
  
  // This is a utility component that doesn't render anything
  return null;
}