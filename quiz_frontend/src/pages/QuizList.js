import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizAPI } from '../services/api';
import Layout from '../components/layout/Layout';

// PUBLIC_INTERFACE
const QuizList = () => {
  /**
   * Quiz list page showing all available quizzes
   */
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // PUBLIC_INTERFACE
    const fetchQuizzes = async () => {
      /**
       * Fetch all available quizzes
       */
      try {
        const response = await quizAPI.getQuizzes();
        setQuizzes(response);
      } catch (error) {
        setError('Failed to load quizzes');
        console.error('Error fetching quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading quizzes...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="alert alert-error">
          {error}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Available Quizzes</h1>
        <p className="page-subtitle">Choose a quiz to test your knowledge</p>
      </div>

      {quizzes.length === 0 ? (
        <div className="card text-center">
          <h2>No Quizzes Available</h2>
          <p className="text-secondary">
            There are currently no quizzes available. Please check back later.
          </p>
        </div>
      ) : (
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-card">
              <div className="quiz-content">
                <h3 className="quiz-title">{quiz.title}</h3>
                <p className="quiz-description">{quiz.description}</p>
                
                <div className="quiz-meta">
                  <span className="quiz-questions">
                    {quiz.questions_count || 0} questions
                  </span>
                  <span className={`quiz-difficulty difficulty-${(quiz.difficulty || 'medium').toLowerCase()}`}>
                    {quiz.difficulty || 'Medium'}
                  </span>
                </div>

                {quiz.time_limit && (
                  <div className="quiz-time">
                    <span className="time-icon">⏱️</span>
                    Time limit: {quiz.time_limit} minutes
                  </div>
                )}
              </div>

              <div className="quiz-actions">
                <Link 
                  to={`/quiz/${quiz.id}`} 
                  className="btn btn-primary w-full"
                >
                  Start Quiz
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default QuizList;
