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
- **Platform Support**: iOS, Android
- **Responsive Design**: Fully responsive UI that consistently supports both iOS and Android across all screen sizes

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

### Production-Ready Dual Theme Architecture

The project implements a sophisticated, production-tested dual-theme system with zero bleeding between contexts:

1. **Global Theme Provider** (`ThemeProvider.tsx`)
   - Basic light/dark theming  
   - Global application styling for main screens

2. **Service Theme Context** (`ServiceThemeContext.tsx`) - **ENHANCED**
   - Advanced service-specific theming with navigation awareness
   - Theme stack management for proper back navigation
   - Automatic theme switching based on route context
   - Performance-optimized with memoized functions
   - Service-specific component variants and layouts
   - **Zero theme bleeding** between main and service screens

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

### **CRITICAL: Theme System Usage**

**⚠️ MANDATORY: Always follow the established theme patterns. Never create hardcoded colors or bypass the theme system.**

#### **Correct Theme Implementation:**

```typescript
// ✅ ALWAYS use ServiceThemeContext for service-specific components
const { tokens, activeService, setActiveService } = useServiceTheme();

// ✅ Use theme tokens for all styling
const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.background, // ✅ Correct
    borderColor: tokens.colors.border,         // ✅ Correct
  }
});

// ✅ For service layouts, use the standardized hook
const { screenOptions, isTransitioning } = useServiceLayout(ServiceTypes.EDUCATION);

// ✅ Component variants based on active service
<Button 
  variant={activeService === 'healthcare' ? 'clinical' : 'default'}
  color={tokens.colors.primary} // ✅ Always use tokens
/>
```

#### **❌ NEVER DO THIS:**

```typescript
// ❌ Never use hardcoded colors
backgroundColor: '#0D47A1'  // Wrong!
color: 'blue'               // Wrong!

// ❌ Never bypass the theme system
const customColor = '#6A1B9A'; // Wrong!

// ❌ Never use old theme patterns
const { theme } = useTheme(); // Deprecated approach
```

#### **Service Layout Pattern (REQUIRED):**

```typescript
// ✅ All service layouts MUST follow this pattern
import { useServiceLayout } from "@/hooks/useServiceLayout";
import { ServiceTypes } from "@/utils/constants";

export default function ServiceLayout() {
  const { screenOptions, isTransitioning } = useServiceLayout(ServiceTypes.EDUCATION);
  
  return (
    <Stack screenOptions={screenOptions}>
      {/* Service screens */}
    </Stack>
  );
}
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
│   ├── (services)/               # Service-specific screens - ENHANCED
│   │   ├── education/            # Education service with proper theming
│   │   │   ├── _layout.tsx       # Theme-aware layout
│   │   │   └── (tabs)/           # Education tabs
│   │   ├── booking/              # Booking service - FIXED
│   │   │   ├── _layout.tsx       # Proper theme integration
│   │   │   └── (tabs)/           # Booking tabs
│   │   ├── healthcare/           # Healthcare service - NEW
│   │   │   ├── _layout.tsx       # Standardized layout
│   │   │   └── (tabs)/           # Healthcare tabs
│   │   └── entertainment/        # Entertainment service - NEW
│   │       ├── _layout.tsx       # Standardized layout
│   │       └── (tabs)/           # Entertainment tabs
│   └── (modals)/                 # Modal presentations
├── components/                   # Reusable UI components
│   ├── ui/                       # Basic components (Button, Input, Card)
│   │   └── ThemeTransitionGuard.tsx # NEW: Prevents theme bleeding
│   ├── forms/                    # Form components
│   ├── service/                  # Service-specific components
│   ├── navigation/               # NEW: Navigation utilities
│   │   └── NavigationThemeManager.tsx # Global theme management
│   └── debug/                    # NEW: Development tools
│       ├── ThemeDebugger.tsx     # Theme validation component
│       └── EducationThemeTest.tsx # Service theme testing
├── providers/                    # Context providers
│   ├── AuthProvider.tsx
│   ├── ThemeProvider.tsx
│   └── ServicesProvider.tsx
├── services/                     # External integrations
│   ├── api/                      # API calls
│   └── storage/                  # Secure storage
├── contexts/                     # React contexts - ENHANCED
│   └── ServiceThemeContext.tsx   # Advanced dual-theme system
├── hooks/                        # Custom hooks - ENHANCED
│   ├── useServiceLayout.ts       # NEW: Standardized service layouts
│   ├── useNavigationThemeManager.ts # NEW: Navigation-aware theming
│   ├── useSmartBackNavigation.ts # NEW: Intelligent back navigation
│   ├── useServiceTheme.ts        # Enhanced theme management
│   └── useThemedStyles.ts        # Theme-aware styling
├── utils/                        # Utility functions and types
│   ├── tokens.ts                 # Design token system
│   └── constants.ts              # App constants
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

### **Enhanced State Management**
- **Context-based Architecture**: AuthContext, ServiceThemeContext (production-ready)
- **Advanced Custom Hooks**: 
  - `useAuth`: Authentication state management
  - `useAuthState`: Authentication status tracking  
  - `useServiceTheme`: Enhanced service theme switching with navigation awareness
  - `useServiceLayout`: **NEW** - Standardized service layout management
  - `useThemedStyles`: Component styling with theme awareness
  - `useSmartBackNavigation`: **NEW** - Intelligent navigation with theme cleanup
  - `useNavigationThemeManager`: **NEW** - Automatic route-based theme switching

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

## **CRITICAL Development Guidelines**

### **🎨 MANDATORY Theme System Rules**

**⚠️ NEVER bypass the theme system. Always follow established patterns.**

1. **Service Theme Switching**: 
   - ✅ Use `useServiceLayout(ServiceTypes.EDUCATION)` for all service layouts
   - ✅ Themes automatically switch on navigation with zero bleeding
   - ✅ Theme stack manages proper back navigation cleanup

2. **Theme Token Usage**:
   - ✅ **ALWAYS** use `tokens.colors.primary` instead of hardcoded colors
   - ✅ **ALWAYS** use `tokens.spacing.md` instead of hardcoded spacing
   - ❌ **NEVER** use `#6A1B9A` or any hardcoded color values

3. **Component Variants**: 
   - ✅ Use service-specific component variants based on `activeService`
   - ✅ Leverage `tokens.gradients` for service-specific gradients

4. **Performance**: 
   - ✅ All theme functions are memoized for optimal performance
   - ✅ Theme transitions are smooth with built-in guards

### **📝 MANDATORY Code Conventions**

1. **TypeScript Strictness**:
   - ✅ **ALWAYS** fix TypeScript errors immediately - never ignore them
   - ✅ Use proper types from `@/utils/constants` and `@/contexts/ServiceThemeContext`
   - ✅ Maintain strict typing with path aliases (@/*)
   - ❌ **NEVER** use `any` types or ignore TypeScript warnings

2. **File Organization**:
   - ✅ Group components by service when applicable
   - ✅ Use standardized import patterns
   - ✅ Follow the established folder structure

3. **Custom Hooks Priority**:
   - ✅ Use `useServiceLayout` for all service layouts
   - ✅ Use `useServiceTheme` for theme-aware components
   - ✅ Use `useSmartBackNavigation` for intelligent navigation
   - ❌ **NEVER** create custom theme logic - use existing hooks

### **🔧 MANDATORY Navigation Patterns**

1. **Service Layout Standard**:
   ```typescript
   // ✅ REQUIRED pattern for all service layouts
   export default function ServiceLayout() {
     const { screenOptions, isTransitioning } = useServiceLayout(ServiceTypes.SERVICE_NAME);
     return <Stack screenOptions={screenOptions}>{/* screens */}</Stack>;
   }
   ```

2. **Navigation Rules**:
   - ✅ Use `useSmartBackNavigation` for complex navigation flows
   - ✅ Let the theme system handle navigation-based theme switching
   - ❌ **NEVER** manually manage theme state during navigation

3. **Route Organization**:
   - ✅ Use group routes `(services)/servicename/` for service organization
   - ✅ Use `(modals)` group for overlay screens
   - ✅ Implement service-specific tab structures with proper theming

### **🐛 Error Handling Requirements**

1. **TypeScript Errors**:
   - ✅ **ALWAYS** fix TypeScript errors before implementation
   - ✅ Use proper type imports and interfaces
   - ✅ Never suppress or ignore type warnings

2. **Theme Debugging**:
   - ✅ Use `<ThemeDebugger />` component for theme validation
   - ✅ Check console logs for theme switching confirmation
   - ✅ Verify theme isolation between services

3. **Performance Monitoring**:
   - ✅ Watch for infinite loop warnings (should never occur)
   - ✅ Verify smooth theme transitions
   - ✅ Ensure no theme bleeding between contexts

## **Enhanced Key Custom Hooks**

### **useServiceTheme (ENHANCED)**
```typescript
const { 
  activeService,          // Current service theme
  tokens,                 // Theme tokens (colors, spacing, etc.)
  setActiveService,       // Switch service theme
  resetToGlobalTheme,     // Return to main theme
  isTransitioning,        // Theme transition state
  themeStack,            // Navigation theme history
  popServiceTheme        // Navigate back with theme cleanup
} = useServiceTheme();
```

### **useServiceLayout (NEW - REQUIRED)**
```typescript
// ✅ MANDATORY for all service layouts
const { 
  screenOptions,          // Pre-configured screen options with theme
  isTransitioning,        // Transition state
  tokens                  // Current theme tokens
} = useServiceLayout(ServiceTypes.EDUCATION);
```

### **useSmartBackNavigation (NEW)**
```typescript
const { 
  goBack,                 // Smart back with theme cleanup
  goToMainApp,           // Navigate to main with theme reset
  hasThemeStack,         // Check if navigation history exists
  currentTheme           // Current active theme
} = useSmartBackNavigation();
```

### **useThemedStyles (ENHANCED)**
```typescript
// ✅ Use for dynamic theme-aware styling
const styles = useThemedStyles((tokens, layout, variants) => 
  StyleSheet.create({
    container: {
      backgroundColor: tokens.colors.background,
      padding: tokens.spacing.md,
      borderRadius: tokens.borderRadius.card,
    }
  })
);
```

### **useAuth**
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

## **CRITICAL DEVELOPMENT RULES - MUST FOLLOW**

### **🚨 HIGHEST PRIORITY RULES**

1. **TypeScript Error Policy**:
   - ✅ **MANDATORY**: Fix ALL TypeScript errors immediately
   - ✅ **MANDATORY**: Never ignore or suppress TypeScript warnings
   - ✅ **MANDATORY**: Use proper type imports and interfaces
   - ❌ **FORBIDDEN**: Using `any` types or `@ts-ignore` comments

2. **Theme System Compliance**:
   - ✅ **MANDATORY**: Always use `useServiceLayout` for service layouts
   - ✅ **MANDATORY**: Use `tokens.colors.*` instead of hardcoded colors
   - ✅ **MANDATORY**: Follow established theme patterns exactly
   - ❌ **FORBIDDEN**: Bypassing the theme system with custom colors
   - ❌ **FORBIDDEN**: Using deprecated theme approaches

3. **Navigation Architecture**:
   - ✅ **MANDATORY**: Use `useSmartBackNavigation` for complex flows
   - ✅ **MANDATORY**: Let the theme system handle navigation-based switching
   - ✅ **MANDATORY**: Follow the standardized service layout pattern
   - ❌ **FORBIDDEN**: Manual theme state management during navigation

### **🎯 DEVELOPMENT STANDARDS**

4. **Code Quality Requirements**:
   - ✅ **ALWAYS** run lint and typecheck commands after changes
   - ✅ **ALWAYS** use the design token system for consistent styling
   - ✅ **ALWAYS** use established custom hooks - never recreate theme logic
   - ✅ **ALWAYS** follow the nested routing patterns in app structure

5. **Performance & Architecture**:
   - ✅ **MAINTAIN** existing performance optimizations
   - ✅ **USE** mock APIs structured for real API endpoints
   - ✅ **ENSURE** theme switching remains automatic and smooth
   - ✅ **VERIFY** zero theme bleeding between services

6. **Git & Deployment**:
   - ✅ **NEVER** commit without explicit user request
   - ✅ **ALWAYS** be conservative with git operations
   - ✅ **TEST** theme functionality before any commits

### **🐛 DEBUGGING REQUIREMENTS**

7. **Theme Validation**:
   - ✅ **USE** `<ThemeDebugger />` component for theme testing
   - ✅ **CHECK** console logs for theme switching confirmations
   - ✅ **VERIFY** education theme shows purple (#6A1B9A), not blue
   - ✅ **ENSURE** no infinite loop warnings appear

8. **Error Prevention**:
   - ✅ **WATCH** for "Maximum update depth exceeded" errors (should never occur)
   - ✅ **MONITOR** smooth theme transitions without flicker
   - ✅ **VALIDATE** proper theme isolation between contexts

### **📚 ARCHITECTURAL DECISIONS**

**Current Architecture**: Service-level theme management (not global)
- **Reasoning**: Better isolation, fewer conflicts, easier debugging
- **NavigationThemeManager**: Currently disabled to prevent conflicts
- **Service Layouts**: Each service manages its own theme via `useServiceLayout`

**Theme System Status**: Production-ready with zero bleeding
- **Education Theme**: Purple (#6A1B9A) - VERIFIED WORKING
- **Booking Theme**: Blue (#0D47A1) - STANDARDIZED
- **Healthcare Theme**: Green (#2E7D32) - STANDARDIZED  
- **Entertainment Theme**: Pink (#E91E63) - STANDARDIZED

## **Recent Critical Fixes & Improvements**

### **🔧 Latest Architecture Fixes (COMPLETED)**

1. **Infinite Loop Resolution**:
   - ✅ **FIXED**: "Maximum update depth exceeded" errors
   - ✅ **SOLUTION**: Stabilized function references with useRef patterns
   - ✅ **RESULT**: Smooth theme switching without infinite renders

2. **Education Theme Fix**:
   - ✅ **FIXED**: Education service now shows purple theme (#6A1B9A) correctly
   - ✅ **SOLUTION**: Disabled conflicting NavigationThemeManager, enhanced useServiceLayout
   - ✅ **RESULT**: Perfect theme isolation between services

3. **Enhanced Theme System**:
   - ✅ **ADDED**: ThemeTransitionGuard to prevent bleeding
   - ✅ **ADDED**: Smart back navigation with theme cleanup
   - ✅ **ADDED**: Comprehensive debug tools and testing components
   - ✅ **RESULT**: Production-ready dual-theme system with zero conflicts

### **📁 New Architecture Files**

- `hooks/useServiceLayout.ts` - Standardized service layouts
- `hooks/useNavigationThemeManager.ts` - Route-based theme switching
- `hooks/useSmartBackNavigation.ts` - Intelligent navigation
- `components/ui/ThemeTransitionGuard.tsx` - Theme bleeding prevention
- `components/debug/ThemeDebugger.tsx` - Development testing tool
- `THEME_ARCHITECTURE.md` - Complete theme system documentation
- `EDUCATION_THEME_FIX.md` - Detailed fix documentation

### **🎯 Current System Status**

- ✅ **Theme System**: Production-ready, zero bleeding, smooth transitions
- ✅ **Education Theme**: Purple (#6A1B9A) working correctly
- ✅ **Performance**: Optimized with memoized functions, no infinite loops
- ✅ **Architecture**: Service-level theme management, better isolation
- ✅ **Testing**: Comprehensive debug tools and validation components

## Git Branch Information

Current branch: `theme-changes`
Main branch: (not specified - check with user for default branch name)

## **SUMMARY FOR CLAUDE**

This ServeMe codebase now features a **production-ready dual-theme system** with:
- **Zero theme bleeding** between main and service contexts
- **Automatic theme switching** based on navigation
- **Performance-optimized** architecture with memoized functions
- **Comprehensive debugging tools** for theme validation
- **Standardized patterns** for all service implementations

**CRITICAL**: Always follow the theme system patterns, fix TypeScript errors immediately, and use established hooks. The architecture is now stable and should be maintained exactly as documented.