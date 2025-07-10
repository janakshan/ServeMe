// utils/constants.ts
export const Colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93',
  lightGray: '#F2F2F7',
  darkGray: '#3A3A3C',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  large: 28,
  title: 24,
  headline: 20,
  body: 16,
  caption: 14,
  small: 12,
};

export const ServiceTypes = {
  BOOKING: 'booking',
  EDUCATION: 'education',
  HEALTHCARE: 'healthcare',
  ENTERTAINMENT: 'entertainment',
} as const;