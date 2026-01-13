import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

// PUBLIC_INTERFACE
const Layout = ({ children }) => {
  /**
   * Main layout component with responsive sidebar
   */
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  // PUBLIC_INTERFACE
  const toggleSidebar = () => {
    /**
     * Toggle sidebar visibility on mobile
     */
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      <main className="main-content">
        <div className="mobile-header">
          <button 
            className="mobile-menu-button"
            onClick={toggleSidebar}
          >
            ☰
          </button>
          <span className="mobile-title">Quiz Platform</span>
          <div className="mobile-user">
            {user?.name?.[0]?.toUpperCase() || '👤'}
          </div>
        </div>
        
        <div className="content-container">
          {children}
        </div>
      </main>
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
