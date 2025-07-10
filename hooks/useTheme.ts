// hooks/useTheme.ts
import { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '../utils/constants';

interface Theme {
  colors: typeof Colors;
  isDark: boolean;
  spacing: any;
  typography: any;
}

export function useTheme() {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const theme: Theme = {
    colors: Colors,
    isDark,
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    typography: {
      large: 28,
      title: 24,
      headline: 20,
      body: 16,
      caption: 14,
      small: 12,
    },
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return {
    theme,
    isDark,
    toggleTheme,
  };
}