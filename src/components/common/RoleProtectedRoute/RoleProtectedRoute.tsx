import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

/**
 * RoleProtectedRoute Component
 *
 * Protects admin routes by checking:
 * 1. User is authenticated
 * 2. User has required role (ADMIN or EDITOR)
 *
 * Redirects:
 * - Unauthenticated users → /novels (login modal will appear)
 * - Authenticated but unauthorized users → /403
 *
 * INTEGRATION NOTE:
 * - Assumes user object from AuthContext has a 'role' property
 * - Adjust allowedRoles prop based on your backend's role system
 * - Example user object: { id: 1, email: 'admin@example.com', role: 'ADMIN' }
 */

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'ADMIN' | 'EDITOR' | 'USER' | 'SUPER_ADMIN'>;
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles = ['ADMIN', 'EDITOR', 'SUPER_ADMIN'] }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Show loading state while auth is being verified
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-slate-500">
        Loading...
      </div>
    );
  }

  // ========================================
  // 🚧 DEVELOPMENT MODE: BYPASS AUTHENTICATION
  // ========================================
  // TODO: Remove this block in production
  // This allows testing admin dashboard without logging in

  const DEVELOPMENT_MODE = false; // Set to true to bypass auth (currently DISABLED for role-based testing)

  if (DEVELOPMENT_MODE) {
    // Allow access without authentication for testing
    return children;
  }

  // ========================================
  // PRODUCTION MODE: FULL AUTHENTICATION
  // ========================================

  // Not authenticated - redirect to novels page (login modal will appear)
  if (!isAuthenticated || !user) {
    return <Navigate to="/novels" replace />;
  }

  // TODO: INTEGRATION POINT
  // Replace this mock role check with actual user.role from your backend
  // Current assumption: user object has a 'role' property
  // Example: const userRole = user.role;

  // MOCK: For development, simulate ADMIN role
  // Remove this mock and use real user.role from backend
  // MOCK: For development, simulate ADMIN role
  // Remove this mock and use real user.role from backend
  const userRole = user.role; // FIXED: Do not default to ADMIN

  // Check if user's role is in the allowed roles
  const hasRequiredRole = allowedRoles.includes(userRole);

  // Authenticated but doesn't have required role - redirect to 403
  if (!hasRequiredRole) {
    return <Navigate to="/403" replace />;
  }

  // User is authenticated and has required role - render the protected component
  return children;
};

export default RoleProtectedRoute;
