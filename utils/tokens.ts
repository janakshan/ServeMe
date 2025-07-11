// Design Token System - Semantic tokens for consistent theming
export interface ColorTokens {
  // Brand Colors
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  accent: string;

  // Surface Colors
  background: string;
  surface: string;
  surfaceElevated: string;

  // Text Colors
  onPrimary: string;
  onSecondary: string;
  onSurface: string;
  onSurfaceVariant: string;
  onBackground: string;

  // State Colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Border & Divider
  border: string;
  divider: string;

  // Input Colors
  inputBackground: string;
  inputBorder: string;
  placeholder: string;
}

export interface TypographyTokens {
  // Font Sizes
  display: number;
  headline1: number;
  headline2: number;
  title: number;
  subtitle: number;
  body: number;
  caption: number;
  small: number;

  // Font Weights
  light: string;
  regular: string;
  medium: string;
  semibold: string;
  bold: string;

  // Line Heights
  tight: number;
  normal: number;
  relaxed: number;
}

export interface SpacingTokens {
  // Base spacing scale
  xxs: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;

  // Component specific
  buttonPadding: {
    horizontal: number;
    vertical: number;
  };
  inputPadding: {
    horizontal: number;
    vertical: number;
  };
  cardPadding: {
    horizontal: number;
    vertical: number;
  };
}

export interface BorderRadiusTokens {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;

  // Component specific
  button: number;
  input: number;
  card: number;
  modal: number;
}

export interface ShadowTokens {
  none: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  sm: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  md: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  lg: {
    shadowColor: string;
    shadowOffset: { width: number; height: number };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
}

export interface DesignTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  borderRadius: BorderRadiusTokens;
  shadows: ShadowTokens;
}

// Professional Azure Theme (Global Default)
export const professionalAzureTokens: DesignTokens = {
  colors: {
    // Brand Colors
    primary: "#0D47A1",
    primaryDark: "#1565C0",
    primaryLight: "#42A5F5",
    secondary: "#1976D2",
    accent: "#2196F3",

    // Surface Colors
    background: "#F8FCFF",
    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",

    // Text Colors
    onPrimary: "#FFFFFF",
    onSecondary: "#FFFFFF",
    onSurface: "#1A237E",
    onSurfaceVariant: "#546E7A",
    onBackground: "#1A1A1A",

    // State Colors
    success: "#4CAF50",
    warning: "#FF9800",
    error: "#F44336",
    info: "#2196F3",

    // Border & Divider
    border: "#E0E0E0",
    divider: "#F5F5F5",

    // Input Colors
    inputBackground: "#E8F4FD",
    inputBorder: "#42A5F5",
    placeholder: "#546E7A",
  },

  typography: {
    // Font Sizes
    display: 32,
    headline1: 28,
    headline2: 24,
    title: 22,
    subtitle: 18,
    body: 16,
    caption: 14,
    small: 12,

    // Font Weights
    light: "300",
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",

    // Line Heights
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },

  spacing: {
    // Base spacing scale
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,

    // Component specific
    buttonPadding: {
      horizontal: 24,
      vertical: 18,
    },
    inputPadding: {
      horizontal: 16,
      vertical: 16,
    },
    cardPadding: {
      horizontal: 24,
      vertical: 28,
    },
  },

  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,

    // Component specific
    button: 14,
    input: 12,
    card: 32,
    modal: 24,
  },

  shadows: {
    none: {
      shadowColor: "transparent",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 24,
      elevation: 12,
    },
    lg: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.15,
      shadowRadius: 32,
      elevation: 16,
    },
  },
};

// Light Theme Variant
export const lightTokens: DesignTokens = {
  ...professionalAzureTokens,
  colors: {
    ...professionalAzureTokens.colors,
    background: "#FFFFFF",
    surface: "#F8F9FA",
    onSurface: "#1A1A1A",
    onSurfaceVariant: "#6C757D",
  },
};

// Dark Theme Variant
export const darkTokens: DesignTokens = {
  ...professionalAzureTokens,
  colors: {
    ...professionalAzureTokens.colors,
    // Brand colors remain the same
    background: "#121212",
    surface: "#1E1E1E",
    surfaceElevated: "#2D2D2D",
    onSurface: "#E0E0E0",
    onSurfaceVariant: "#BDBDBD",
    onBackground: "#FFFFFF",
    border: "#333333",
    divider: "#404040",
    inputBackground: "#2D2D2D",
    inputBorder: "#42A5F5",
    placeholder: "#9E9E9E",
  },
};
