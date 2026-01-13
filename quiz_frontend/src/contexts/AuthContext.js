import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        user: action.payload.user, 
        token: action.payload.token,
        isAuthenticated: true,
        error: null 
      };
    case 'LOGIN_ERROR':
      return { 
        ...state, 
        loading: false, 
        error: action.payload, 
        isAuthenticated: false,
        user: null,
        token: null
      };
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        token: null, 
        isAuthenticated: false, 
        error: null 
      };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: true 
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// PUBLIC_INTERFACE
export const AuthProvider = ({ children }) => {
  /**
   * Provides authentication context to child components
   */
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for existing auth token on app load
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        const parsedUser = JSON.parse(user);
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          payload: { user: parsedUser, token } 
        });
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // PUBLIC_INTERFACE
  const login = async (email, password) => {
    /**
     * Authenticate user with email and password
     */
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authAPI.login(email, password);
      
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: response.user, token: response.token } 
      });
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // PUBLIC_INTERFACE
  const signup = async (email, password, name) => {
    /**
     * Register new user account
     */
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authAPI.signup(email, password, name);
      
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: response.user, token: response.token } 
      });
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed';
      dispatch({ type: 'LOGIN_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // PUBLIC_INTERFACE
  const logout = async () => {
    /**
     * Log out current user
     */
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// PUBLIC_INTERFACE
export const useAuth = () => {
  /**
   * Hook to access authentication context
   */
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
