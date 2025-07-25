// Move useAuthState to a separate file to avoid circular imports
// hooks/useAuthState.ts - CREATE THIS NEW FILE
import { useEffect, useState } from "react";
import { AuthContextType } from "../contexts/AuthContext";
import { authApi } from "../services/api/auth";
import { secureStorage } from "../services/storage/secureStorage";

export function useAuthState(): AuthContextType {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      console.log("🔍 Checking auth state...");

      // Check onboarding status first
      const onboardingStatus = await secureStorage.getOnboardingStatus();
      console.log("📚 Onboarding status:", onboardingStatus);
      setHasCompletedOnboarding(onboardingStatus === "completed");

      // Check authentication
      const token = await secureStorage.getToken();
      console.log("🎫 Stored token:", token ? "exists" : "none");

      if (token) {
        try {
          const userData = await authApi.verifyToken(token);
          console.log("✅ Token verified, user:", userData);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.log("❌ Token invalid, removing...");
          // Token is invalid, remove it
          await secureStorage.removeToken();
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    } catch (error) {
      console.error("🚨 Auth check failed:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log("🏁 Auth check complete");
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("🔐 Starting login process...");
      const response = await authApi.login(email, password);
      console.log("✅ Login API success:", response);

      await secureStorage.setToken(response.token);
      console.log("💾 Token saved");

      setUser(response.user);
      setIsAuthenticated(true);
      console.log("🎉 Login complete!");
    } catch (error) {
      console.error("🚨 Login process failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log("👋 Logging out...");
      await secureStorage.removeToken();
      await secureStorage.clearAll();
      setUser(null);
      setIsAuthenticated(false);
      console.log("✅ Logout complete");
    } catch (error) {
      console.error("🚨 Logout failed:", error);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      console.log("📝 Starting signup process...");
      const response = await authApi.signup(email, password, name);
      console.log("✅ Signup API success:", response);

      await secureStorage.setToken(response.token);
      console.log("💾 Token saved");

      setUser(response.user);
      setIsAuthenticated(true);
      console.log("🎉 Signup complete!");
    } catch (error) {
      console.error("🚨 Signup process failed:", error);
      throw error;
    }
  };

  return {
    isAuthenticated,
    isLoading,
    hasCompletedOnboarding,
    user,
    login,
    logout,
    signup,
  };
}
