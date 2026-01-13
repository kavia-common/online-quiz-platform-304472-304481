import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

// PUBLIC_INTERFACE
const Login = () => {
  /**
   * Login form component for user authentication
   */
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  // PUBLIC_INTERFACE
  const handleChange = (e) => {
    /**
     * Handle form input changes
     */
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    /**
     * Handle form submission
     */
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card card">
        <div className="auth-header text-center mb-6">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
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
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-large w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="loading-spinner-small"></div>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="auth-footer text-center mt-6">
          <p className="auth-link-text">
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
