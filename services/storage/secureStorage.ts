// services/storage/secureStorage.ts
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'user_token';
const ONBOARDING_KEY = 'onboarding_status';
const USER_PREFERENCES_KEY = 'user_preferences';

export const secureStorage = {
  async setToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },

  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  async removeToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },

  async setOnboardingStatus(status: 'completed' | 'pending'): Promise<void> {
    await SecureStore.setItemAsync(ONBOARDING_KEY, status);
  },

  async getOnboardingStatus(): Promise<string | null> {
    return await SecureStore.getItemAsync(ONBOARDING_KEY);
  },

  async setUserPreferences(preferences: object): Promise<void> {
    await SecureStore.setItemAsync(USER_PREFERENCES_KEY, JSON.stringify(preferences));
  },

  async getUserPreferences(): Promise<object | null> {
    const prefs = await SecureStore.getItemAsync(USER_PREFERENCES_KEY);
    return prefs ? JSON.parse(prefs) : null;
  },

  async clearAll(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(ONBOARDING_KEY);
    await SecureStore.deleteItemAsync(USER_PREFERENCES_KEY);
  },
};