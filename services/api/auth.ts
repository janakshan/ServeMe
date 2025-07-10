// services/api/auth.ts - FIXED VERSION with debugging
const API_BASE_URL = "https://your-api-endpoint.com/api";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// Mock user for development
const MOCK_USER = {
  id: "1",
  email: "admin@serveme.sg",
  name: "Test User",
};

// Valid test credentials
const VALID_CREDENTIALS = {
  email: "admin@serveme.sg",
  password: "Manager1@3",
};

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      console.log("🔐 Login attempt:", { email, password }); // Debug log
      console.log("📧 Email comparison:", email === VALID_CREDENTIALS.email);
      console.log(
        "🔑 Password comparison:",
        password === VALID_CREDENTIALS.password
      );

      // Trim whitespace and normalize
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPassword = password.trim();

      console.log("🧹 Normalized email:", normalizedEmail);
      console.log("🧹 Expected email:", VALID_CREDENTIALS.email);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check credentials (case-insensitive email)
      if (
        normalizedEmail === VALID_CREDENTIALS.email &&
        normalizedPassword === VALID_CREDENTIALS.password
      ) {
        console.log("✅ Login successful!");
        return {
          token: "mock-jwt-token-" + Date.now(),
          user: MOCK_USER,
        };
      } else {
        console.log("❌ Login failed - credentials mismatch");
        console.log("Expected:", VALID_CREDENTIALS);
        console.log("Received:", {
          email: normalizedEmail,
          password: normalizedPassword,
        });
        throw new Error("Invalid credentials");
      }

      // Uncomment this when you have a real API:
      /*
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      return response.json();
      */
    } catch (error) {
      console.error("🚨 Login error:", error);
      throw error;
    }
  },

  async signup(
    email: string,
    password: string,
    name: string
  ): Promise<LoginResponse> {
    try {
      console.log("📝 Signup attempt:", { email, name });

      // Mock signup for development
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("✅ Signup successful!");
      return {
        token: "mock-jwt-token-" + Date.now(),
        user: {
          id: Date.now().toString(),
          email: email.trim().toLowerCase(),
          name: name.trim(),
        },
      };
    } catch (error) {
      console.error("🚨 Signup error:", error);
      throw error;
    }
  },

  async verifyToken(token: string): Promise<any> {
    try {
      console.log("🔍 Verifying token:", token);

      // Mock token verification
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (token && token.startsWith("mock-jwt-token-")) {
        console.log("✅ Token valid");
        return MOCK_USER;
      } else {
        console.log("❌ Token invalid");
        throw new Error("Invalid token");
      }
    } catch (error) {
      console.error("🚨 Token verification error:", error);
      throw error;
    }
  },

  async forgotPassword(email: string): Promise<void> {
    try {
      console.log("📧 Password reset requested for:", email);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("✅ Password reset email sent");
    } catch (error) {
      console.error("🚨 Forgot password error:", error);
      throw error;
    }
  },
};

// Alternative: Simple bypass for testing
export const authApiSimple = {
  async login(email: string, password: string): Promise<LoginResponse> {
    console.log("🔄 Using simple auth bypass");

    // Always return success for testing
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      token: "test-token-" + Date.now(),
      user: {
        id: "1",
        email: email,
        name: "Test User",
      },
    };
  },

  // ... other methods remain the same
  signup: authApi.signup,
  verifyToken: authApi.verifyToken,
  forgotPassword: authApi.forgotPassword,
};
