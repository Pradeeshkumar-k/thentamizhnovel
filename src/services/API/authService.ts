import apiClient from './client';
import { API_ENDPOINTS } from './config';
import { LoginCredentials, SignupData, AuthCredentials } from '../../types';

export const authService = {
  // Login
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, credentials);

      // Handle different possible response structures
      const data = response.data.data || response.data;
      const { user, token, refreshToken, accessToken } = data;

      // Store auth token (handle both 'token' and 'accessToken' field names)
      const authToken = token || accessToken;
      if (authToken) {
        localStorage.setItem('authToken', authToken);
      }

      // Store refresh token if provided
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Store user data
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  },

  // Signup
  signup: async (userData: SignupData) => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.SIGNUP, userData);

      // Handle different possible response structures
      const data = response.data.data || response.data;
      const { user, token, refreshToken, accessToken } = data;

      // Store auth token (handle both 'token' and 'accessToken' field names)
      const authToken = token || accessToken;
      if (authToken) {
        localStorage.setItem('authToken', authToken);
      }

      // Store refresh token if provided
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      // Store user data
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      return { success: true, data: response.data };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Signup failed',
      };
    }
  },

  // Unified Authentication (Login/Signup) - kept for compatibility if needed, but logic reduced
  authenticate: async (credentials: AuthCredentials) => {
    // This endpoint doesn't strictly exist in backend, assuming it maps to login for now or specific logic needed
    // Defaulting to login behavior if not specified
    // Casting to LoginCredentials as a fallback assumption
    return authService.login(credentials as unknown as LoginCredentials);
  },

  // Logout
  logout: async () => {
    try {
      // Optional: invalidating token on backend if endpoint exists
      // await apiClient.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      // Silently handle
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.reload(); 
    }
  },

  // Verify token
  verifyToken: async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return { success: false };
      }
      const response = await apiClient.get(API_ENDPOINTS.VERIFY_TOKEN, {
        headers: {
            Authorization: `Bearer ${token}`
        }
      });
      const { user } = response.data;
      if (user) {
         localStorage.setItem('user', JSON.stringify(user));
      }
      return { success: true, data: response.data };
    } catch (error: any) {
      // 🟢 FIX: Handle 401 silently, log others
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        return { success: false };
      }
      
      console.error("Auth verify failed:", error);
      // If verify fails, clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      return { success: false };
    }
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },
};

export default authService;
