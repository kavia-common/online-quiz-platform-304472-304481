import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { quizAPI } from '../services/api';
import Layout from '../components/layout/Layout';

// PUBLIC_INTERFACE
const Profile = () => {
  /**
   * User profile page showing user information and quiz history
   */
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
    recentAttempts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // PUBLIC_INTERFACE
    const fetchUserStats = async () => {
      /**
       * Fetch user statistics and recent attempts
       */
      try {
        const attempts = await quizAPI.getMyAttempts();
        
        const totalAttempts = attempts.length;
        const scores = attempts.map(attempt => attempt.score || 0);
        const averageScore = scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0;
        const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
        
        setUserStats({
          totalAttempts,
          averageScore,
          bestScore,
          recentAttempts: attempts.slice(0, 10)
        });
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">View your account information and quiz history</p>
      </div>

      <div className="profile-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Account Information</h2>
          </div>
          
          <div className="profile-info">
            <div className="info-item">
              <label className="info-label">Name</label>
              <div className="info-value">{user?.name || 'Not provided'}</div>
            </div>
            
            <div className="info-item">
              <label className="info-label">Email</label>
              <div className="info-value">{user?.email || 'Not provided'}</div>
            </div>
            
            <div className="info-item">
              <label className="info-label">Role</label>
              <div className="info-value">
                <span className={`role-badge ${user?.role === 'admin' || user?.is_admin ? 'admin' : 'student'}`}>
                  {user?.role === 'admin' || user?.is_admin ? 'Administrator' : 'Student'}
                </span>
              </div>
            </div>
            
            <div className="info-item">
              <label className="info-label">Member Since</label>
              <div className="info-value">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Quiz Statistics</h2>
          </div>
          
          <div className="stats-grid-small">
            <div className="stat-item">
              <div className="stat-value">{userStats.totalAttempts}</div>
              <div className="stat-label">Total Attempts</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-value">{userStats.averageScore}%</div>
              <div className="stat-label">Average Score</div>
            </div>
            
            <div className="stat-item">
              <div className="stat-value">{userStats.bestScore}%</div>
              <div className="stat-label">Best Score</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <div className="card-header">
          <h2 className="card-title">Recent Quiz History</h2>
          <p className="card-description">Your latest quiz attempts</p>
        </div>

        {userStats.recentAttempts.length === 0 ? (
          <div className="text-center">
            <p className="text-secondary">No quiz attempts yet.</p>
          </div>
        ) : (
          <div className="attempts-list">
            {userStats.recentAttempts.map((attempt) => (
              <div key={attempt.id} className="attempt-item">
                <div className="attempt-info">
                  <h4 className="attempt-title">{attempt.quiz_title}</h4>
                  <p className="attempt-date">
                    {new Date(attempt.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="attempt-score">
                  <span className={`score-badge ${attempt.score >= 70 ? 'success' : attempt.score >= 50 ? 'warning' : 'danger'}`}>
                    {attempt.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Profile;
