import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Home, LogOut, ChevronDown } from 'lucide-react';

/**
 * Admin Header Component
 *
 * Top navigation bar for admin dashboard featuring:
 * - Mobile menu toggle
 * - User profile dropdown
 * - Logout functionality
 */

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Derive page title from location
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard Overview';
    if (path.includes('/novels/create')) return 'Create New Novel';
    if (path.includes('/novels/edit')) return 'Edit Novel';
    if (path.includes('/novels')) return 'Novel Management';
    if (path.includes('/chapters')) return 'Chapter Management';
    return 'Admin Panel';
  };

  // Close dropdown when clicking outside
  const toggleProfileMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/novels');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return 'AD';
    const email = user.email;
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 h-[80px] bg-bg-primary/95 backdrop-blur-sm border-b border-white/5 flex items-center justify-between px-6 z-10 shadow-sm transition-colors duration-300">
      {/* Mobile menu button */}
      <button
        className="md:hidden p-2 -ml-2 text-secondary hover:text-primary hover:bg-muted/10 rounded-lg transition-colors"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Page title - dynamic based on route */}
      <div className="flex-1 ml-4 md:ml-0">
        <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight transition-all duration-300">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right section - User profile */}
      <div className="flex items-center gap-4">
        {/* User profile dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-3 px-3 py-2 bg-surface hover:bg-muted/10 border border-border rounded-lg text-secondary hover:text-primary transition-all duration-200 group"
            onClick={toggleProfileMenu}
            aria-label="User menu"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shadow-sm">
              {getUserInitials()}
            </div>
            <div className="hidden sm:flex flex-col items-start gap-0.5">
              <span className="text-sm font-semibold text-primary capitalize leading-none text-left">
                {user?.email?.split('@')[0] || 'Admin'}
              </span>
              <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">
                {user?.role || 'ADMIN'}
              </span>
            </div>
            <ChevronDown className={`hidden sm:block w-3.5 h-3.5 text-muted transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown menu */}
          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-[998]"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute top-[calc(100%+0.5rem)] right-0 w-[240px] bg-surface border border-border rounded-lg shadow-xl z-[999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 bg-muted/5 border-b border-border">
                  <p className="text-sm font-medium text-primary mb-1 break-all">{user?.email}</p>
                  <span className="inline-block text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded uppercase tracking-wider">{user?.role || 'ADMIN'}</span>
                </div>

                <div className="p-1">
                    <button
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-secondary hover:text-primary hover:bg-muted/10 transition-colors text-sm font-medium text-left"
                    onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/novels');
                    }}
                    >
                    <Home className="w-4 h-4 text-blue-500" />
                    <span>Main Site</span>
                    </button>

                    <div className="h-px bg-border my-1 mx-2" />

                    <button
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-red-500 hover:bg-red-500/10 transition-colors text-sm font-medium text-left"
                    onClick={() => {
                        setShowProfileMenu(false);
                        handleLogout();
                    }}
                    >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                    </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
