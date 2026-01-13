import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { quizAPI } from '../services/api';
import Layout from '../components/layout/Layout';

// PUBLIC_INTERFACE
const Dashboard = () => {
  /**
   * Dashboard page showing user statistics and recent activity
   */
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
    recentAttempts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // PUBLIC_INTERFACE
    const fetchDashboardData = async () => {
      /**
       * Fetch dashboard statistics and recent attempts
       */
      try {
        const [quizzesResponse, attemptsResponse] = await Promise.all([
          quizAPI.getQuizzes(),
          quizAPI.getMyAttempts()
        ]);

        const totalQuizzes = quizzesResponse.length;
        const attempts = attemptsResponse;
        const completedQuizzes = new Set(attempts.map(a => a.quiz_id)).size;
        
        const totalScore = attempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
        const averageScore = attempts.length > 0 ? Math.round(totalScore / attempts.length) : 0;

        setStats({
          totalQuizzes,
          completedQuizzes,
          averageScore,
          recentAttempts: attempts.slice(0, 5)
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="dashboard-subtitle">
            Ready to test your knowledge today?
          </p>
        </div>
        <Link to="/quizzes" className="btn btn-primary">
          Take a Quiz
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">📚</div>
          <div className="stat-value">{stats.totalQuizzes}</div>
          <div className="stat-label">Available Quizzes</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon secondary">✅</div>
          <div className="stat-value">{stats.completedQuizzes}</div>
          <div className="stat-label">Completed Quizzes</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon primary">🎯</div>
          <div className="stat-value">{stats.averageScore}%</div>
          <div className="stat-label">Average Score</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon secondary">🏆</div>
          <div className="stat-value">{stats.recentAttempts.length}</div>
          <div className="stat-label">Total Attempts</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Quiz Attempts</h2>
          <p className="card-description">Your latest quiz results</p>
        </div>

        {stats.recentAttempts.length === 0 ? (
          <div className="text-center">
            <p className="text-secondary">No quiz attempts yet.</p>
            <Link to="/quizzes" className="btn btn-primary mt-4">
              Take Your First Quiz
            </Link>
          </div>
        ) : (
          <div className="recent-attempts">
            {stats.recentAttempts.map((attempt) => (
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

export default Dashboard;
