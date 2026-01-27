import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface UserLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserLogin: React.FC<UserLoginProps> = ({ isOpen, onClose }) => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Use login service
        const result = await login({
          username: formData.email,  // Backend uses email, frontend type requires username
          password: formData.password,
        });

        if (result.success) {
          onClose();
          // Reset form
          setFormData({ username: '', email: '', password: '', confirmPassword: '', name: '' });

          // ROLE-BASED REDIRECT: ADMIN/EDITOR → dashboard, USER → novels
          const user = result.data?.user;
          if (user && (user.role === 'ADMIN' || user.role === 'EDITOR')) {
            // Redirect admin/editor to dashboard
            navigate('/admin/dashboard');
          } else {
            // Redirect regular users to novels page
            navigate('/novels');
          }
        } else {
          setError(result.error || 'Authentication failed');
        }
      } else {
        // Signup validation
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        // Use signup service
        const result = await signup({
          username: formData.username || formData.email.split('@')[0],
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });

        if (result.success) {
          onClose();
          // Reset form
          setFormData({ username: '', email: '', password: '', confirmPassword: '', name: '' });
        } else {
          setError(result.error || 'Authentication failed');
        }
      }
    } catch (_err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Backdrop animation
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  // Modal animation
  const modalVariants: any = {
    hidden: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95,
      rotateX: 10
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      rotateX: 0,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30 
      }
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.95,
      transition: { duration: 0.2 } 
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-[2000] flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto py-12"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div 
          className="relative w-full max-w-md overflow-hidden bg-slate-900 border border-neon-gold/30 rounded-2xl shadow-neon-gold"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative glowing background elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-gold via-white to-neon-magenta opacity-70"></div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-gold/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-neon-magenta/10 rounded-full blur-3xl"></div>

          <div className="relative p-6 sm:p-8">
            {/* Close Button */}
            <button 
              type="button" 
              className="absolute top-4 right-4 p-2 text-slate-400 transition-colors rounded-full hover:text-white hover:bg-white/10"
              onClick={onClose}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Header / Tabs */}
            <div className="flex mb-8 space-x-6 border-b border-gray-700">
              <button
                type="button"
                className={`pb-3 text-lg font-bold transition-all relative ${
                  isLogin ? 'text-neon-gold' : 'text-gray-400 hover:text-gray-200'
                }`}
                onClick={() => setIsLogin(true)}
              >
                Login
                {isLogin && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-gold shadow-glow-sm"
                  />
                )}
              </button>
              <button
                type="button"
                className={`pb-3 text-lg font-bold transition-all relative ${
                  !isLogin ? 'text-neon-magenta cancel-neon-gold' : 'text-gray-400 hover:text-gray-200'
                }`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
                {!isLogin && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-neon-magenta shadow-glow-sm"
                  />
                )}
              </button>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="px-4 py-3 text-sm text-red-200 bg-red-900/30 border border-red-500/30 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
              <AnimatePresence mode='wait'>
                {!isLogin && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    className="space-y-1.5"
                  >
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 text-white transition-all bg-slate-800/50 border border-gray-600 rounded-xl focus:outline-none focus:border-neon-magenta focus:ring-1 focus:ring-neon-magenta placeholder-gray-500"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`w-full px-4 py-3 text-white transition-all bg-slate-800/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-1 placeholder-gray-500 ${
                    isLogin ? 'focus:border-neon-gold focus:ring-neon-gold' : 'focus:border-neon-magenta focus:ring-neon-magenta'
                  }`}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`w-full px-4 py-3 text-white transition-all bg-slate-800/50 border border-gray-600 rounded-xl focus:outline-none focus:ring-1 placeholder-gray-500 ${
                    isLogin ? 'focus:border-neon-gold focus:ring-neon-gold' : 'focus:border-neon-magenta focus:ring-neon-magenta'
                  }`}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                />
              </div>

              <AnimatePresence mode='wait'>
                {!isLogin && (
                  <motion.div
                    key="confirm-password-field"
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -20, height: 0 }}
                    className="space-y-1.5"
                  >
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="w-full px-4 py-3 text-white transition-all bg-slate-800/50 border border-gray-600 rounded-xl focus:outline-none focus:border-neon-magenta focus:ring-1 focus:ring-neon-magenta placeholder-gray-500"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirm your password"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3.5 mt-2 text-base font-bold text-black rounded-xl shadow-lg transition-all ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                } ${
                  isLogin 
                    ? 'bg-neon-gold hover:bg-cyan-300 shadow-neon-gold/50' 
                    : 'bg-neon-magenta hover:bg-fuchsia-300 shadow-neon-magenta/50'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Process...
                  </span>
                ) : (
                  isLogin ? 'Login' : 'Sign Up'
                )}
              </motion.button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center text-gray-400">
              {isLogin ? (
                <p>
                  Don't have an account?{' '}
                  <button 
                    type="button" 
                    onClick={() => setIsLogin(false)} 
                    className="font-medium text-neon-gold hover:text-cyan-300 hover:underline transition-colors"
                  >
                    Sign up here
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button 
                    type="button" 
                    onClick={() => setIsLogin(true)} 
                    className="font-medium text-neon-magenta hover:text-fuchsia-300 hover:underline transition-colors"
                  >
                    Login here
                  </button>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserLogin;
