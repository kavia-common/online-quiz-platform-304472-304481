import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// PUBLIC_INTERFACE
const Signup = () => {
  /**
   * Signup form component for user registration
   */
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  const { signup, loading, error } = useAuth();
  const navigate = useNavigate();

  // PUBLIC_INTERFACE
  const validateForm = () => {
    /**
     * Validate form data
     */
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // PUBLIC_INTERFACE
  const handleChange = (e) => {
    /**
     * Handle form input changes
     */
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    // Clear specific field error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: '',
      });
    }
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    /**
     * Handle form submission
     */
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await signup(formData.email, formData.password, formData.name);
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card">
        <div className="auth-header text-center mb-6">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join our quiz platform today</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-input ${formErrors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
            {formErrors.name && (
              <span className="form-error">{formErrors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${formErrors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
            {formErrors.email && (
              <span className="form-error">{formErrors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={`form-input ${formErrors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {formErrors.password && (
              <span className="form-error">{formErrors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              className={`form-input ${formErrors.confirmPassword ? 'error' : ''}`}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
            {formErrors.confirmPassword && (
              <span className="form-error">{formErrors.confirmPassword}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-large w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="loading-spinner-small"></div>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="auth-footer text-center mt-6">
          <p className="auth-link-text">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
