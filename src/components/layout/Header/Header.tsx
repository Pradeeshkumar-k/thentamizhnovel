import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, BookOpen, Info, PhoneCall, User, LayoutDashboard, LogOut, Search, Moon, Sun, Globe, Menu as MenuIcon, X } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { translations } from '../../../translations';
import logo from '../../../assets/images/brand/TTM NOVRLS.png';
// // import styles from './Header.module.scss'; // SCSS REPLACED BY TAILWIND // Removed SCSS

interface HeaderProps {
  onLoginClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const mobileLanguageDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const _t = translations[language as keyof typeof translations];

  // Close dropdown when clicking outside or pressing ESC
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageDropdownRef.current && 
        !languageDropdownRef.current.contains(event.target as Node) &&
        mobileLanguageDropdownRef.current && 
        !mobileLanguageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLanguageDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLanguageDropdownOpen(false);
        setIsUserDropdownOpen(false);
      }
    };

    if (isLanguageDropdownOpen || isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isLanguageDropdownOpen, isUserDropdownOpen]);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      setIsUserDropdownOpen(!isUserDropdownOpen);
    } else {
      if (onLoginClick) {
        onLoginClick();
      } else {
        navigate('/login');
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  const _toggleLanguageDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const executeSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/novels?search=${encodeURIComponent(query.trim())}`);
      return true;
    }
    return false;
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (executeSearch(searchQuery)) {
        if (isMenuOpen) setIsMenuOpen(false);
    }
  };

  const handleMobileSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (executeSearch(searchQuery)) {
          setIsSearchOpen(false);
      }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-[#010133]/95 dark:bg-bg-primary/90 backdrop-blur-md z-[1000] border-b border-white/10 dark:border-border shadow-sm transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-4 py-2 flex flex-col md:flex-row items-center gap-4 md:gap-0 md:justify-between">
          
          {/* TOP ROW (Mobile: Logo + Icons | Desktop: Logo + Search + Nav) */}
          <div className="w-full md:w-auto flex items-center justify-between md:justify-start md:gap-4 lg:gap-12">
            
            {/* LOGO */}
            <img 
                src={logo} 
                alt="Logo" 
                className="h-20 md:h-24 lg:h-24 w-auto cursor-pointer object-contain hover:scale-105 transition-transform duration-300 drop-shadow-sm" 
                onClick={() => navigate('/')} 
            />

          {/* MOBILE ICONS ROW (Theme + Profile + Lang + Menu) */}
          <div className="flex items-center gap-3 md:hidden">
                {/* THEME TOGGLE (Restored) */}
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-primary transition-all hover:border-neon-gold hover:text-neon-gold"
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

               {/* USER PROFILE (Mobile) */}
               <div className="relative" ref={userDropdownRef}>
                  <button
                     onClick={handleAuthClick}
                     className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-secondary hover:text-neon-gold hover:border-neon-gold transition-all"
                  >
                     <User size={20} />
                  </button>
               </div>

                {/* MOBILE LANG */}
                <div className="relative" ref={mobileLanguageDropdownRef}>
                   <button 
                      onClick={(e) => { e.stopPropagation(); setIsLanguageDropdownOpen(!isLanguageDropdownOpen); }}
                      className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-secondary hover:text-neon-gold hover:border-neon-gold transition-all"
                   >
                      <Globe size={20} />
                   </button>
                   {isLanguageDropdownOpen && (
                      <div className="absolute top-12 right-0 bg-[#ffffff] dark:bg-black border border-border/50 dark:border-neon-gold/50 rounded-lg shadow-xl w-40 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[1100]">
                         <button onClick={() => { changeLanguage('tamil'); setIsLanguageDropdownOpen(false); }} className={`w-full text-left px-4 py-2 hover:bg-muted/10 transition-colors ${language === 'tamil' ? 'text-black dark:text-white font-bold bg-muted/5' : 'text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white'}`}>தமிழ் (Tamil)</button>
                         <button onClick={() => { changeLanguage('english'); setIsLanguageDropdownOpen(false); }} className={`w-full text-left px-4 py-2 hover:bg-muted/10 transition-colors ${language === 'english' ? 'text-black dark:text-white font-bold bg-muted/5' : 'text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white'}`}>English</button>
                      </div>
                   )}
                </div>

                <button 
                    type="button" 
                    className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 p-2 bg-transparent border-none text-primary hover:text-neon-gold transition-colors"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
                </button>
            </div>
          </div>

          {/* DESKTOP NAV & CONTROLS */}
          <div className="hidden md:flex items-center flex-1 justify-between md:ml-4 lg:ml-8">
              {/* SEARCH BAR */}
               <form onSubmit={handleSearch} className="relative flex items-center bg-surface/50 border border-border rounded-full px-4 py-2 md:w-[140px] lg:w-[220px] hover:border-neon-gold/50 focus-within:border-neon-gold focus-within:ring-1 focus-within:ring-neon-gold transition-all group">
                     <button type="submit" className="shrink-0 flex items-center justify-center">
                        <Search className="w-5 h-5 text-gray-500 dark:text-gray-400 group-focus-within:text-neon-gold transition-colors" />
                     </button>
                    <input
                      type="text"
                      placeholder={_t.header.search}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none text-primary px-3 text-sm placeholder:text-muted min-w-0"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="w-5 h-5 flex items-center justify-center rounded-full bg-muted/20 text-muted hover:text-primary hover:bg-muted/40 shrink-0"
                        onClick={() => setSearchQuery('')}
                      >
                        <X size={14} />
                      </button>
                    )}
               </form>

              {/* NAV LINKS */}
               <nav className="flex items-center md:gap-3 lg:gap-6 md:text-sm lg:text-base">
                <span className="flex items-center gap-1.5 text-gray-300 dark:text-secondary hover:text-neon-gold cursor-pointer font-medium transition-colors" onClick={() => navigate('/')}>
                  <Home size={16} />
                  {_t.header.home}
                </span>
                <span className="flex items-center gap-1.5 text-gray-300 dark:text-secondary hover:text-neon-gold cursor-pointer font-medium transition-colors" onClick={() => navigate('/library')}>
                  <BookOpen size={16} />
                  {_t.header.library}
                </span>
                <span className="flex items-center gap-1.5 text-gray-300 dark:text-secondary hover:text-neon-gold cursor-pointer font-medium transition-colors" onClick={() => navigate('/about')}>
                  <Info size={16} />
                  {_t.header.about}
                </span>
                <span className="flex items-center gap-1.5 text-gray-300 dark:text-secondary hover:text-neon-gold cursor-pointer font-medium transition-colors" onClick={() => navigate('/contact')}>
                  <PhoneCall size={16} />
                  {_t.header.contact}
                </span>
               </nav>

               {/* ICONS GROUP */}
               <div className="flex items-center md:gap-1.5 lg:gap-3">
                  {/* THEME */}
                  <button
                    onClick={toggleTheme}
                    className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-secondary hover:text-neon-gold hover:border-neon-gold transition-all"
                  >
                     {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                  </button>

                  {/* LANG */}
                  <div className="relative" ref={languageDropdownRef}>
                     <button 
                        onClick={(e) => { e.stopPropagation(); setIsLanguageDropdownOpen(!isLanguageDropdownOpen); }}
                        className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-secondary hover:text-neon-gold hover:border-neon-gold transition-all"
                     >
                        <Globe size={20} />
                     </button>
                     {isLanguageDropdownOpen && (
                        <div className="absolute top-12 right-0 bg-[#ffffff] dark:bg-black border border-border/50 dark:border-neon-gold/50 rounded-lg shadow-xl w-40 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-[1100]">
                           <button onClick={(e) => { e.stopPropagation(); changeLanguage('tamil'); setIsLanguageDropdownOpen(false); }} className={`w-full text-left px-4 py-2 hover:bg-muted/10 transition-colors ${language === 'tamil' ? 'text-black dark:text-white font-bold bg-muted/5' : 'text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white'}`}>தமிழ் (Tamil)</button>
                           <button onClick={(e) => { e.stopPropagation(); changeLanguage('english'); setIsLanguageDropdownOpen(false); }} className={`w-full text-left px-4 py-2 hover:bg-muted/10 transition-colors ${language === 'english' ? 'text-black dark:text-white font-bold bg-muted/5' : 'text-black/80 dark:text-white/80 hover:text-black dark:hover:text-white'}`}>English</button>
                        </div>
                     )}
                  </div>

                  {/* PROFILE */}
                  <div className="relative" ref={userDropdownRef}>
                     <button
                        onClick={handleAuthClick}
                        className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-secondary hover:text-neon-gold hover:border-neon-gold transition-all"
                     >
                        <User size={20} />
                     </button>

                     {isAuthenticated && isUserDropdownOpen && (
                        <div className="absolute top-12 right-0 bg-[#ffffff] dark:bg-black border border-border/50 dark:border-neon-gold rounded-lg shadow-xl w-56 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                           <div className="px-4 py-3 border-b border-border/50">
                              <p className="font-bold text-black dark:text-neon-gold truncate">{user?.name}</p>
                              <p className="text-xs text-muted truncate">{user?.email}</p>
                           </div>
                           <button onClick={() => { navigate('/profile'); setIsUserDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-black dark:text-white hover:bg-muted/10 transition-colors">
                              {_t.header.profile}
                           </button>
                           {user?.role === 'ADMIN' && (
                              <button onClick={() => { navigate('/admin/dashboard'); setIsUserDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-black dark:text-white hover:bg-muted/10 transition-colors">
                                 {_t.header.adminDashboard}
                              </button>
                           )}
                           <div className="h-px bg-border/50 my-1" />
                           <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-500/10 transition-colors">
                              {_t.header.logout}
                           </button>
                        </div>
                     )}
                  </div>
               </div>
          </div>

          {/* MOBILE SEARCH - Always Visible, Slightly Larger */}
          <div className="md:hidden w-full max-w-xs px-2">
               <form onSubmit={handleMobileSearchSubmit} className="relative flex items-center bg-surface/50 border border-border rounded-full px-3 py-2 w-full hover:border-neon-gold/50 focus-within:border-neon-gold transition-all">
                    <button type="submit" className="w-5 h-5 shrink-0 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-neon-gold transition-colors">
                        <Search size={18} />
                    </button>
                    <input
                        type="text"
                        placeholder={_t.header.search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-primary px-2 text-sm placeholder:text-muted w-full"
                    />
                    {searchQuery && (
                       <button type="button" onClick={() => setSearchQuery('')} className="text-muted hover:text-primary"><X size={14} /></button>
                    )}
                 </form>
          </div>

        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isMenuOpen && (
           <div className="md:hidden absolute top-full left-0 w-full bg-[#ffffff] dark:bg-black border-t border-border shadow-xl p-4 flex flex-col gap-1.5 animate-in slide-in-from-top-2 duration-300 z-[1000]">
              <div 
                onClick={() => { navigate('/'); setIsMenuOpen(false); }} 
                className="flex items-center gap-4 p-3 rounded-xl text-black dark:text-white hover:bg-muted/10 hover:text-neon-gold cursor-pointer transition-all group"
              >
                <Home size={20} className="text-black/60 dark:text-neon-gold/70 group-hover:text-neon-gold" />
                <span className="font-semibold tracking-tight">{_t.header.home}</span>
              </div>

              <div 
                onClick={() => { navigate('/library'); setIsMenuOpen(false); }} 
                className="flex items-center gap-4 p-3 rounded-xl text-black dark:text-white hover:bg-muted/10 hover:text-neon-gold cursor-pointer transition-all group"
              >
                <BookOpen size={20} className="text-black/60 dark:text-neon-gold/70 group-hover:text-neon-gold" />
                <span className="font-semibold tracking-tight">{_t.header.library}</span>
              </div>

              <div 
                onClick={() => { navigate('/about'); setIsMenuOpen(false); }} 
                className="flex items-center gap-4 p-3 rounded-xl text-black dark:text-white hover:bg-muted/10 hover:text-neon-gold cursor-pointer transition-all group"
              >
                <Info size={20} className="text-black/60 dark:text-neon-gold/70 group-hover:text-neon-gold" />
                <span className="font-semibold tracking-tight">{_t.header.about}</span>
              </div>

              <div 
                onClick={() => { navigate('/contact'); setIsMenuOpen(false); }} 
                className="flex items-center gap-4 p-3 rounded-xl text-black dark:text-white hover:bg-muted/10 hover:text-neon-gold cursor-pointer transition-all group"
              >
                <PhoneCall size={20} className="text-black/60 dark:text-neon-gold/70 group-hover:text-neon-gold" />
                <span className="font-semibold tracking-tight">{_t.header.contact}</span>
              </div>
              
              <div className="h-px bg-border/50 my-2 mx-2" />

              {isAuthenticated ? (
                  <>
                      <div className="px-4 py-3 mb-2 bg-muted/5 rounded-2xl border border-border/30">
                          <p className="font-black text-black dark:text-neon-gold text-sm truncate uppercase tracking-widest">{user?.name || 'Admin User'}</p>
                          <p className="text-[10px] text-muted truncate font-bold mt-0.5">{user?.email}</p>
                      </div>

                      <div 
                        onClick={() => { navigate('/profile'); setIsMenuOpen(false); }} 
                        className="flex items-center gap-4 p-3 rounded-xl text-black dark:text-white hover:bg-muted/10 hover:text-neon-gold cursor-pointer transition-all group"
                      >
                        <User size={20} className="text-black/60 dark:text-neon-gold/70 group-hover:text-neon-gold" />
                        <span className="font-semibold tracking-tight">{_t.header.profile}</span>
                      </div>
                      
                      {user?.role === 'ADMIN' && (
                          <div 
                            onClick={() => { navigate('/admin/dashboard'); setIsMenuOpen(false); }} 
                            className="flex items-center gap-4 p-3 rounded-xl text-black dark:text-white hover:bg-muted/10 hover:text-neon-gold cursor-pointer transition-all group"
                          >
                            <LayoutDashboard size={20} className="text-black/60 dark:text-neon-gold/70 group-hover:text-neon-gold" />
                            <span className="font-semibold tracking-tight">{_t.header.adminDashboard}</span>
                          </div>
                      )}
                      
                      <div className="h-px bg-border/50 my-2 mx-2" />

                      <div 
                        onClick={async () => { await handleLogout(); setIsMenuOpen(false); }} 
                        className="flex items-center gap-4 p-3 rounded-xl text-red-500 hover:bg-red-500/10 cursor-pointer transition-all group"
                      >
                        <LogOut size={20} className="opacity-70 group-hover:opacity-100" />
                        <span className="font-bold tracking-tight">{_t.header.logout}</span>
                      </div>
                  </>
              ) : (
                  <div 
                    onClick={() => { if (onLoginClick) onLoginClick(); else navigate('/login'); setIsMenuOpen(false); }} 
                    className="flex items-center gap-4 p-3 rounded-xl text-black dark:text-white hover:bg-muted/10 hover:text-neon-gold cursor-pointer transition-all group"
                  >
                    <User size={20} className="text-black/60 dark:text-neon-gold/70 group-hover:text-neon-gold" />
                    <span className="font-bold tracking-tight">Login / Get Started</span>
                  </div>
              )}
           </div>
        )}
      </header>
    </>
  );
};

export default Header;
