# ServeMe

A modern React Native service marketplace app built with Expo, featuring authentication, service booking, and a beautiful Professional Azure theme.

## Features

### 🔐 Authentication System
- **Login/Signup**: Email and password authentication with form validation
- **Remember Me**: Secure credential storage using Expo SecureStore
- **Password Reset**: Forgot password functionality with email reset
- **Full-Screen Design**: Modern card-based UI without navigation headers

### 🎨 Professional Azure Theme
- **Consistent Color Scheme**: Professional blue theme (#0D47A1, #1565C0, #42A5F5)
- **Modern UI Components**: Custom styled inputs, buttons, and cards
- **Accessibility**: High contrast ratios and screen reader support
- **Dark Mode Ready**: Theme system prepared for multiple variants

### 📱 App Features
- **Service Marketplace**: Browse and book various services
- **Booking Management**: History, favorites, and active bookings
- **User Profile**: Settings, preferences, and account management
- **Notifications**: In-app notification system
- **Payments**: Payment processing integration
- **Promotions**: Deals and offers management

### 🏗️ Architecture
- **Expo Router**: File-based navigation with nested routing
- **Context API**: Centralized state management for auth and themes
- **Custom Hooks**: Reusable logic for authentication and services
- **Component Library**: Modular, reusable UI components
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: React Native with Expo SDK 50
- **Navigation**: Expo Router (file-based routing)
- **UI**: Custom components with Professional Azure theme
- **Authentication**: Mock auth service (ready for real API integration)
- **Storage**: Expo SecureStore for sensitive data
- **State Management**: React Context + Custom Hooks
- **Development**: TypeScript, ESLint, Prettier

## Installation

### Prerequisites
- Node.js (18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/janakshan/ServeMe.git
   cd ServeMe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS dependencies** (iOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on platforms**
   - **iOS**: Press `i` in the terminal or `npx expo run:ios`
   - **Android**: Press `a` in the terminal or `npx expo run:android`
   - **Web**: Press `w` in the terminal

## Project Structure

```
ServeMe/
├── app/                          # Expo Router pages
│   ├── (auth)/                   # Authentication screens
│   │   ├── login.tsx            # Login screen
│   │   ├── signup.tsx           # Signup screen
│   │   └── forgot-password.tsx  # Password reset
│   ├── (app)/                   # Main app screens
│   │   └── (tabs)/              # Tab navigation
│   ├── (services)/              # Service-related screens
│   └── (modals)/                # Modal screens
├── components/                   # Reusable components
│   ├── ui/                      # Basic UI components
│   ├── forms/                   # Form components
│   └── auth/                    # Auth-specific components
├── contexts/                     # React contexts
├── hooks/                        # Custom hooks
├── providers/                    # Context providers
├── services/                     # API and external services
│   ├── api/                     # API integration
│   └── storage/                 # Storage utilities
├── utils/                        # Utility functions
├── assets/                       # Static assets
└── ios/                         # iOS native configuration
```

## Authentication

### Test Credentials
For development and testing, use these credentials:
- **Email**: `admin@serveme.sg`
- **Password**: `Manager1@3`

### API Integration
The app uses a mock authentication service. To integrate with a real API:

1. Update `services/api/auth.ts`
2. Replace mock functions with actual API calls
3. Update the `API_BASE_URL` constant
4. Configure authentication tokens and storage

## Development

### Available Scripts
- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run on web browser

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (when configured)

### Adding New Features
1. Create components in `components/` directory
2. Add screens in appropriate `app/` subdirectory
3. Use existing hooks and contexts for state management
4. Follow the established naming conventions

## Deployment

### iOS Deployment
1. **Build for iOS**
   ```bash
   npx expo build:ios
   ```

2. **Submit to App Store**
   ```bash
   npx expo submit:ios
   ```

### Android Deployment
1. **Build for Android**
   ```bash
   npx expo build:android
   ```

2. **Submit to Google Play**
   ```bash
   npx expo submit:android
   ```

## Theme Customization

The app uses a Professional Azure theme with these key colors:
- **Primary**: `#0D47A1` (Deep blue)
- **Secondary**: `#1565C0` (Azure blue)
- **Accent**: `#42A5F5` (Light blue)
- **Background**: `#F8FCFF` (Light blue-white)

To customize the theme:
1. Update colors in component styles
2. Modify the theme context (when implemented)
3. Ensure accessibility compliance

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary. All rights reserved.

## Contact

**Developer**: Janakshan  
**Repository**: [https://github.com/janakshan/ServeMe](https://github.com/janakshan/ServeMe)

---

Built with ❤️ using React Native and Expo