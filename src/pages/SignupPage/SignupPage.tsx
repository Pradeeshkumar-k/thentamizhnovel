import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './SignupPage.module.scss';

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profile: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');

    try {
      const result = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        profile: formData.profile
      });
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Signup failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles['signup-page']}>
      <div className={styles['signup-container']}>
        <div className={styles['signup-card']}>
          <div className={styles['signup-header']}>
            <h1>Create Account</h1>
            <p>Join us to start reading amazing novels</p>
          </div>

          <form onSubmit={handleSubmit} className={styles['signup-form']}>
            {error && (
              <div className={styles['error-message']}>
                {error}
              </div>
            )}

            <div className={styles['form-group']}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                disabled={isLoading}
              />
            </div>

            <div className={styles['form-group']}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>

            <div className={styles['form-group']}>
              <label htmlFor="profile">Profile</label>
              <input
                type="text"
                id="profile"
                name="profile"
                value={formData.profile}
                onChange={handleChange}
                placeholder="Enter your profile/bio"
                disabled={isLoading}
              />
            </div>

            <div className={styles['form-group']}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                disabled={isLoading}
                minLength={6}
              />
            </div>

            <div className={styles['form-group']}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                disabled={isLoading}
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className={styles['signup-button']}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className={styles['signup-footer']}>
            <p>
              Already have an account?{' '}
              <Link to="/login" className={styles['login-link']}>
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;