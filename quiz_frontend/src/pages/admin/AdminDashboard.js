import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizAPI } from '../../services/api';
import Layout from '../../components/layout/Layout';

// PUBLIC_INTERFACE
const AdminDashboard = () => {
  /**
   * Admin dashboard showing system statistics and management overview
   */
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalUsers: 0,
    totalAttempts: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // PUBLIC_INTERFACE
    const fetchAdminStats = async () => {
      /**
       * Fetch admin dashboard statistics
       */
      try {
        // For now, we'll fetch available data
        // In a real implementation, you'd have dedicated admin endpoints
        const quizzesResponse = await quizAPI.getQuizzes();
        
        setStats(prevStats => ({
          ...prevStats,
          totalQuizzes: quizzesResponse.length,
          // These would come from actual admin endpoints:
          totalUsers: 156, // Mock data
          totalAttempts: 1247, // Mock data
          recentActivity: [
            { type: 'quiz_created', description: 'New quiz "React Fundamentals" created', time: '2 hours ago' },
            { type: 'user_registered', description: 'New user registered: john@example.com', time: '4 hours ago' },
            { type: 'quiz_completed', description: 'Quiz "JavaScript Basics" completed by user', time: '6 hours ago' },
          ]
        }));
      } catch (error) {
        setError('Failed to load admin statistics');
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">
            Manage your quiz platform from here
          </p>
        </div>
        <Link to="/admin/quizzes" className="btn btn-primary">
          Manage Quizzes
        </Link>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          {error}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">📚</div>
          <div className="stat-value">{stats.totalQuizzes}</div>
          <div className="stat-label">Total Quizzes</div>
          <Link to="/admin/quizzes" className="stat-link">
            Manage →
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon secondary">👥</div>
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-label">Registered Users</div>
          <Link to="/admin/users" className="stat-link">
            View →
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon primary">📊</div>
          <div className="stat-value">{stats.totalAttempts}</div>
          <div className="stat-label">Quiz Attempts</div>
          <Link to="/admin/analytics" className="stat-link">
            Analytics →
          </Link>
        </div>

        <div className="stat-card">
          <div className="stat-icon secondary">📈</div>
          <div className="stat-value">
            {stats.totalAttempts > 0 ? Math.round((stats.totalAttempts / stats.totalUsers) * 10) / 10 : 0}
          </div>
          <div className="stat-label">Avg. Attempts/User</div>
        </div>
      </div>

      <div className="admin-grid">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
            <p className="card-description">Common administrative tasks</p>
          </div>

          <div className="admin-actions">
            <Link to="/admin/quizzes/new" className="action-card">
              <div className="action-icon">➕</div>
              <div className="action-content">
                <h4>Create Quiz</h4>
                <p>Add a new quiz to the platform</p>
              </div>
            </Link>

            <Link to="/admin/quizzes" className="action-card">
              <div className="action-icon">📝</div>
              <div className="action-content">
                <h4>Manage Quizzes</h4>
                <p>Edit or delete existing quizzes</p>
              </div>
            </Link>

            <Link to="/admin/users" className="action-card">
              <div className="action-icon">👤</div>
              <div className="action-content">
                <h4>User Management</h4>
                <p>View and manage user accounts</p>
              </div>
            </Link>

            <Link to="/admin/analytics" className="action-card">
              <div className="action-icon">📊</div>
              <div className="action-content">
                <h4>View Analytics</h4>
                <p>See platform performance data</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
            <p className="card-description">Latest platform activity</p>
          </div>

          <div className="activity-list">
            {stats.recentActivity.length === 0 ? (
              <p className="text-secondary text-center">No recent activity</p>
            ) : (
              stats.recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-content">
                    <div className="activity-description">
                      {activity.description}
                    </div>
                    <div className="activity-time">
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
