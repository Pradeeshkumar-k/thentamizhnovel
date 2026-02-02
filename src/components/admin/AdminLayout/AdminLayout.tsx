import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import AdminHeader from '../AdminHeader/AdminHeader';
// import styles from './AdminLayout.module.scss'; // Removed SCSS

/**
 * AdminLayout Component
 *
 * Main layout wrapper for all admin pages featuring:
 * - Responsive sidebar navigation
 * - Top header with user profile
 * - Main content area for nested routes
 *
 * This layout is used by all admin routes via React Router's <Outlet />
 */

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-[100dvh] bg-bg-primary relative transition-colors duration-300">
      {/* Sidebar navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-[100dvh] transition-all duration-300 md:pl-[80px]">
        {/* Top header */}
        <AdminHeader onToggleSidebar={toggleSidebar} />

        {/* Page content - rendered by nested routes */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-bg-primary overflow-x-hidden transition-colors duration-300">
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
