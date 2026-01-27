import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FileText, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../../assets/images/brand/TTM NOVRLS.png';
// import styles from './Sidebar.module.scss'; // Removed SCSS

/**
 * Admin Sidebar Component
 *
 * Provides navigation for the admin dashboard with:
 * - Dashboard overview
 * - Novel management
 * - Chapter management
 *
 * Uses NavLink for active route highlighting
 */

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  // Determine current width for desktop
  const sidebarWidth = isHovered ? 260 : 80;

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      description: 'Overview & Stats'
    },
    {
      path: '/admin/novels',
      icon: <BookOpen size={20} />,
      label: 'Novels',
      description: 'Manage novels'
    },
    {
      path: '/admin/chapters',
      icon: <FileText size={20} />,
      label: 'Chapters',
      description: 'Manage chapters'
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isOpen ? 260 : (window.innerWidth >= 768 ? sidebarWidth : 260),
          x: (isOpen || window.innerWidth >= 768) ? 0 : -260
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed top-0 left-0 h-screen 
          bg-bg-secondary border-r border-glass-border
          flex flex-col z-[999] transition-colors duration-300 shadow-2xl shadow-blue-900/10
          overflow-hidden
        `}
      >
        {/* Logo/Brand */}
        <div className="p-4 h-[80px] flex flex-col justify-center border-b border-glass-border bg-gradient-to-b from-primary/5 to-transparent overflow-hidden whitespace-nowrap">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
              <img src={logo} alt="Logo" className="w-full h-auto object-contain filter drop-shadow-[0_0_12px_rgba(14,165,233,0.4)] dark:drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
            </div>
            <AnimatePresence>
              {(isHovered || isOpen) && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  <h2 className="text-lg font-bold text-primary tracking-widest uppercase leading-none">Admin</h2>
                  <p className="text-[10px] text-neon-blue font-bold tracking-[0.2em] font-[Noto Sans Tamil] mt-1">தமிழ் நாவல்கள்</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 overflow-y-auto scrollbar-none whitespace-nowrap">
          <ul className="space-y-2 px-3">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center h-[52px] gap-4 px-3 rounded-xl transition-all duration-300 group relative
                    ${isActive 
                        ? 'bg-neon-blue/10 text-neon-blue shadow-[inset_0_0_20px_rgba(14,165,233,0.05)]' 
                        : 'text-secondary hover:bg-bg-tertiary hover:text-primary'
                    }`
                  }
                  onClick={onClose}
                >
                  {({ isActive }) => (
                    <>
                        {isActive && <motion.div layoutId="sidebar-active" className="absolute right-0 top-2 bottom-2 w-1 bg-neon-blue rounded-l-full shadow-[0_0_10px_#0ea5e9]" />}
                        <div className={`w-8 flex justify-center transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 opacity-70 group-hover:opacity-100'}`}>
                          {item.icon}
                        </div>
                        <AnimatePresence>
                          {(isHovered || isOpen) && (
                            <motion.div 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              className="flex flex-col leading-none"
                            >
                                <span className="text-[14px] font-bold tracking-tight">{item.label}</span>
                                <span className={`text-[10px] mt-1 opacity-60 ${isActive ? 'text-neon-blue' : ''}`}>{item.description}</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Back to Main Site */}
        <div className="p-4 border-t border-glass-border overflow-hidden whitespace-nowrap">
          <NavLink 
            to="/novels" 
            className="flex items-center h-[48px] gap-3 px-3 rounded-xl border border-glass-border text-secondary transition-all duration-300 hover:bg-bg-tertiary hover:text-primary"
          >
            <div className="w-8 flex justify-center opacity-70">
              <Home size={18} />
            </div>
            <AnimatePresence>
              {(isHovered || isOpen) && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-xs font-bold uppercase tracking-wider"
                >
                  Main Site
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
