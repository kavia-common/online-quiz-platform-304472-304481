import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// PUBLIC_INTERFACE
const Sidebar = ({ isOpen, onToggle }) => {
  /**
   * Sidebar navigation component with menu items
   */
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // PUBLIC_INTERFACE
  const handleLogout = async () => {
    /**
     * Handle user logout
     */
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAdmin = user?.role === 'admin' || user?.is_admin;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="nav-header">
        <h1 className="nav-title">Quiz Platform</h1>
        <p className="nav-subtitle">Interactive Learning</p>
      </div>

      <nav>
        <ul className="nav-menu">
          <li className="nav-item">
            <NavLink to="/dashboard" className="nav-link">
              <span className="nav-icon">📊</span>
              Dashboard
            </NavLink>
          </li>
          
          <li className="nav-item">
            <NavLink to="/quizzes" className="nav-link">
              <span className="nav-icon">📝</span>
              Take Quiz
            </NavLink>
          </li>
          
          <li className="nav-item">
            <NavLink to="/profile" className="nav-link">
              <span className="nav-icon">👤</span>
              Profile
            </NavLink>
          </li>

          {isAdmin && (
            <>
              <li className="nav-item" style={{ marginTop: '2rem' }}>
                <div className="nav-section-header">
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', padding: '0 1rem' }}>
                    Admin
                  </span>
                </div>
              </li>
              
              <li className="nav-item">
                <NavLink to="/admin/dashboard" className="nav-link">
                  <span className="nav-icon">📊</span>
                  Admin Dashboard
                </NavLink>
              </li>
              
              <li className="nav-item">
                <NavLink to="/admin/quizzes" className="nav-link">
                  <span className="nav-icon">⚙️</span>
                  Manage Quizzes
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>

      <div style={{ marginTop: 'auto', padding: '1rem' }}>
        <button 
          onClick={handleLogout}
          className="nav-link"
          style={{ 
            width: '100%', 
            border: 'none', 
            background: 'none',
            textAlign: 'left',
            color: 'var(--error-color)'
          }}
        >
          <span className="nav-icon">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
