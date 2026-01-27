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
    <div className="flex min-h-screen bg-bg-primary relative transition-colors duration-300">
      {/* Sidebar navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 md:ml-[80px]">
        {/* Top header */}
        <AdminHeader onToggleSidebar={toggleSidebar} />

        {/* Page content - rendered by nested routes */}
        <main className="flex-1 p-4 md:p-8 bg-bg-primary overflow-x-hidden transition-colors duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
