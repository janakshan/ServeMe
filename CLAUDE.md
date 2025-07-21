# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# ServeMe - Project Documentation for Claude

## Project Overview

**ServeMe** is a comprehensive multi-service marketplace built with React Native and Expo. It features a sophisticated dual-theme system supporting multiple services including Education, Booking, Healthcare, and Entertainment. The application uses file-based routing with Expo Router and implements advanced state management patterns.

### Core Technologies
- **Framework**: React Native with Expo SDK ~53.0.15
- **Language**: TypeScript with strict mode
- **Navigation**: Expo Router (file-based routing)
- **Architecture**: Modern React Native with New Architecture enabled
- **Platform Support**: iOS, Android, and Web

## Development Commands

```bash
# Development
npm start              # Start Expo development server
npm run android        # Run on Android emulator
npm run ios           # Run on iOS simulator  
npm run web           # Run on web browser

# Testing
npm test              # Run Jest tests in watch mode

# Build Commands
# Use Expo CLI for builds:
# expo build:android or expo build:ios

# Code Quality
npm run lint             # Run ESLint (if configured)
npm run typecheck        # TypeScript type checking (if configured)
```

## Advanced Theme System

### Dual Theme Architecture

The project implements a sophisticated dual-theme system:

1. **Global Theme Provider** (`ThemeProvider.tsx`)
   - Basic light/dark theming
   - Global application styling

2. **Service Theme Context** (`ServiceThemeContext.tsx`)
   - Advanced service-specific theming
   - Dynamic theme switching between services
   - Service-specific component variants

### Service Themes

#### 1. Education Service
- **Primary Color**: Purple (#6A1B9A)
- **Layout**: Academic layout with rounded components
- **Style**: Educational, formal design patterns

#### 2. Booking Service  
- **Primary Color**: Blue (#0D47A1)
- **Layout**: Card-based layout with elevated components
- **Style**: Professional, business-focused design

#### 3. Healthcare Service
- **Primary Color**: Green (#2E7D32)
- **Layout**: Clinical layout with flat components
- **Style**: Medical, clean design patterns

#### 4. Entertainment Service
- **Primary Color**: Pink (#E91E63)
- **Layout**: Entertainment-focused layout
- **Style**: Vibrant, engaging design patterns

### Design Token System

Located in `utils/tokens.ts`, the system includes:

- **Color Tokens**: Primary/secondary colors, surface colors, text colors, state colors
- **Typography**: Font sizes (display to small), weights, line heights
- **Spacing**: Base scale + component-specific padding
- **Border Radius**: Component-specific radius values
- **Shadows**: Multi-level elevation system
- **Gradients**: Service-specific gradients with directional settings

### Theme Implementation

```typescript
// Using themed styles
const styles = useThemedStyles();

// Service theme switching
const { currentService, switchTheme } = useServiceTheme();

// Component variants based on service
<Button variant={currentService === 'healthcare' ? 'clinical' : 'default'} />
```

## Project Structure

```
ServeMe/
├── app/                          # Expo Router pages (file-based routing)
│   ├── (auth)/                   # Authentication group
│   │   ├── login.tsx
│   │   ├── signup.tsx  
│   │   ├── forgot-password.tsx
│   │   └── onboarding/
│   ├── (app)/                    # Main app group
│   │   └── (tabs)/               # Tab navigation
│   ├── (services)/               # Service-specific screens
│   │   ├── education/(tabs)/     # Education service with tabs
│   │   └── booking/(tabs)/       # Booking service structure
│   └── (modals)/                 # Modal presentations
├── components/                   # Reusable UI components
│   ├── ui/                       # Basic components (Button, Input, Card)
│   ├── forms/                    # Form components
│   └── service/                  # Service-specific components
├── providers/                    # Context providers
│   ├── AuthProvider.tsx
│   ├── ThemeProvider.tsx
│   └── ServicesProvider.tsx
├── services/                     # External integrations
│   ├── api/                      # API calls
│   └── storage/                  # Secure storage
├── contexts/                     # React contexts
├── hooks/                        # Custom hooks
├── utils/                        # Utility functions and types
├── assets/                       # Images, fonts, splash screens
├── ios/                          # iOS native configuration
└── android/                      # Android native configuration
```

## Complete Feature Documentation

### Education Service Features

#### Home Dashboard
- User stats, streaks, XP tracking
- Weekly goals and progress monitoring
- Achievement system

#### Courses System
- **Multi-level Education**: Primary, Junior Secondary, O/L, A/L preparation
- **Progress Tracking**: Enrollment status, completion tracking
- **Instructor Details**: Teacher profiles and qualifications
- **Course Categories**: Filtering and search functionality

#### Live Classes
- **Real-time Status**: Live, upcoming, completed class tracking
- **Registration System**: Student enrollment and count tracking
- **Advanced Calendar Integration**: 
  - Day/Week/Month views with interactive scheduling
  - Smooth date navigation across views
  - Event indicators for different class states
- **Class Recordings**: Access to completed session recordings

#### Teachers Directory
- **Detailed Profiles**: Qualifications, teaching history
- **Student Recommendations System**: Reviews with ratings and comments
- **Institution Tracking**: University/College/School affiliations
- **Subject Specializations**: Experience and expertise tracking

#### Exams & Assessment
- Practice exams and assessments
- Progress tracking and performance analytics

#### Leaderboard
- Competitive learning features
- Student rankings and achievements

### Booking Service Features
- **Service Categories**: men_saloon, vehicle_repair, cleaning, parcel, food_delivery
- **Booking Management**: History, favorites, active bookings tracking
- **Service-specific Theming**: Professional blue theme integration

### Authentication System
- **Comprehensive Auth Flow**: Login, signup, OTP verification, forgot password
- **Secure Storage**: Using expo-secure-store for credential management
- **Remember Me**: Persistent login functionality
- **Social Auth**: Google and Facebook integration (ready for implementation)
- **Mock API Integration**: Flexible development environment with real API preparation

## Technical Architecture

### State Management
- **Context-based Architecture**: AuthContext, ServiceThemeContext
- **Custom Hooks**: 
  - `useAuth`: Authentication state management
  - `useAuthState`: Authentication status tracking
  - `useServiceTheme`: Service theme switching
  - `useThemedStyles`: Component styling with theme awareness

### Component Architecture

#### Education Components (`src/education/components/`)
- **Modular Headers**: EducationHeader, EducationScreenHeader, FilterHeader
- **Specialized Cards**: AcademicCard, AchievementProgress
- **Custom Navigation**: EducationTabBar with service theming

#### Reusable UI Components (`components/ui/`)
- **Theme-aware Components**: Button, Card, Input, LoadingSpinner
- **Variant System**: Component variants based on active service theme

### API Integration Pattern

#### Mock vs Real API
- **Flexible API Layer**: Mock APIs structured for real API integration
- **Auth API**: Credential validation, token management, password reset
- **Education API**: Course management, enrollment, progress tracking
- **Debug Logging**: Comprehensive logging for development

### Performance Optimizations
- **Lazy Loading**: `LazyScreen` component for performance
- **Optimized Lists**: `OptimizedServiceList` for large datasets  
- **Dynamic Imports**: Service-specific component loading
- **Image Optimization**: Expo optimized images
- **Client-Only Values**: Platform-specific optimizations

## Development Guidelines

### Theme Implementation
1. **Service Theme Switching**: Services automatically switch themes on navigation
2. **Theme Reset**: Returns to global theme when leaving services
3. **Component Variants**: Use service-specific component variants
4. **Gradient Usage**: Leverage service-specific gradient utilities

### Code Conventions
1. **File Organization**: Group components by service when applicable
2. **Custom Hooks**: Use custom hooks for logic separation and reusability
3. **TypeScript**: Maintain strict typing with path aliases (@/*)
4. **Component Styling**: Use `useThemedStyles` for theme-aware styling

### API Integration
1. **Mock Development**: Use mock APIs for development
2. **Real API Preparation**: Structure mock APIs to match real API patterns
3. **Error Handling**: Implement comprehensive error handling
4. **Loading States**: Use consistent loading patterns across services

### Navigation Patterns
1. **Nested Routes**: Use group routes for service organization
2. **Modal Presentations**: Use `(modals)` group for overlay screens
3. **Tab Navigation**: Implement service-specific tab structures
4. **Deep Linking**: Support deep linking with Expo Router

## Key Custom Hooks

### useServiceTheme
```typescript
const { currentService, switchTheme, theme } = useServiceTheme();
```

### useThemedStyles  
```typescript
const styles = useThemedStyles();
```

### useAuth
```typescript
const { user, login, logout, isLoading } = useAuth();
```

## Service-Specific Architecture

### Education Service
- **Route Structure**: `(services)/education/(tabs)/`
- **Theme**: Purple academic theme with rounded components
- **Features**: Courses, live classes, teachers, calendar integration

### Booking Service
- **Route Structure**: `(services)/booking/(tabs)/`
- **Theme**: Blue professional theme with elevated components
- **Features**: Service booking, history, favorites

## Testing Setup
- **Framework**: Jest with jest-expo preset
- **Test Renderer**: react-test-renderer for snapshot testing
- **Test Location**: `__tests__/` directories
- **Current Coverage**: Component snapshot tests

## Deployment Configuration
- **iOS Bundle ID**: com.janakshan.ServeMe
- **Android**: Adaptive icons and edge-to-edge support
- **Web**: Static output with Metro bundler
- **Expo Plugins**: expo-router, expo-splash-screen, expo-secure-store

## Mock Authentication Credentials

For development and testing:
- **Email**: admin@serveme.sg
- **Password**: Manager1@3

## Important Notes for Development

1. **Always use the appropriate service theme** when working on service-specific features
2. **Leverage the design token system** for consistent styling
3. **Use custom hooks** for logic that might be reused across components
4. **Follow the nested routing patterns** established in the app structure
5. **Mock APIs are structured** to easily switch to real API endpoints
6. **Performance optimizations** are already in place - maintain these patterns
7. **Theme switching is automatic** - no manual theme management needed when navigating between services
8. **Always run lint and typecheck commands** after making changes if they exist
9. **Never commit without explicit user request** - be conservative with git operations

## Git Branch Information

Current branch: `theme-changes`
Main branch: (not specified - check with user for default branch name)

This documentation provides comprehensive context for working with the ServeMe codebase, understanding its sophisticated architecture, and maintaining consistency with established patterns.