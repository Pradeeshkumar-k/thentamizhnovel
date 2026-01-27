import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/API/authService';
import { AuthContextType, User, ApiResponse } from '../types';

// Import MOCK_USERS for authentication logic
const MOCK_USERS = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'admin123',
    role: 'ADMIN',
    name: 'Admin User',
  },
  {
    id: 2,
    email: 'editor@example.com',
    password: 'editor123',
    role: 'EDITOR',
    name: 'Editor User',
  },
  {
    id: 3,
    email: 'user@example.com',
    password: 'user123',
    role: 'USER',
    name: 'Regular User',
  },
];

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const currentUser = authService.getCurrentUser();
      const hasToken = authService.isAuthenticated();

      if (currentUser && hasToken) {
        // For mock authentication, skip backend verification
        // In production, uncomment the verification below

        // Check if it's a mock token (starts with 'mock-jwt-token')
        const token = localStorage.getItem('authToken');
        if (token && token.startsWith('mock-jwt-token')) {
          // Mock token - trust it without verification
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          // Real token - verify with backend
          const { success } = await authService.verifyToken();
          if (success) {
            setUser(currentUser);
            setIsAuthenticated(true);
          } else {
            // Token invalid - clear auth
            await authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials: any) => {
    try {
      const result = await authService.login(credentials);

      if (result.success && result.data) {
        setUser(result.data.user);
        setIsAuthenticated(true);
        // Return user data for role-based redirect
        return { success: true, data: result.data };
      } else {
        const errorMsg = 'error' in result ? result.error : 'Login failed';
        return { success: false, error: errorMsg || 'Login failed' };
      }
    } catch (_error) {
      return { success: false, error: 'Login failed' };
    }
  };

  // Signup function
  const signup = async (userData: any) => {
    try {
      const result = await authService.signup(userData);

      if (result.success && result.data) {
        setUser(result.data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        const errorMsg = 'error' in result ? result.error : 'Signup failed';
        return { success: false, error: errorMsg || 'Signup failed' };
      }
    } catch (_error) {
      return { success: false, error: 'Signup failed' };
    }
  };

  // Unified Authentication function (Login/Signup)
  const authenticate = async (
    credentials: any
  ): Promise<ApiResponse & { action?: 'login' | 'signup' }> => {
    try {
      // For hardcoded auth, determine action based on whether email exists
      const existingUser = MOCK_USERS.find((u) => u.email === credentials.email);

      if (existingUser) {
        // Login
        const result = await authService.login({
          email: credentials.email,
          password: credentials.password,
        });
        if (result.success && result.data) {
          setUser(result.data.user);
          setIsAuthenticated(true);
          return { success: true, data: result.data, action: 'login' as const };
        }
      } else {
        // Signup
        const result = await authService.signup({
          email: credentials.email,
          password: credentials.password,
          username: credentials.username || credentials.email.split('@')[0],
          name: credentials.displayName || credentials.username,
        });
        if (result.success && result.data) {
          setUser(result.data.user);
          setIsAuthenticated(true);
          return { success: true, data: result.data, action: 'signup' as const };
        }
      }

      return { success: false, error: 'Authentication failed' };
    } catch (_error) {
      return { success: false, error: 'Authentication failed' };
    }
  };

  // Logout function
  const logout = async () => {
    await authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    authenticate,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
