import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { quizAPI } from '../services/api';
import Layout from '../components/layout/Layout';

// PUBLIC_INTERFACE
const QuizResults = () => {
  /**
   * Quiz results page showing score, correct answers, and performance analysis
   */
  const { quizId } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get result data from navigation state or fetch from API
  const [result, setResult] = useState(location.state?.result || null);
  const [questions, setQuestions] = useState(location.state?.questions || []);
  const [userAnswers, setUserAnswers] = useState(location.state?.answers || {});

  useEffect(() => {
    if (!result && quizId) {
      // If no result data in state, redirect to quiz list
      // In a real app, you might fetch the latest attempt result here
      setError('No quiz result data available. Please take the quiz again.');
    }
  }, [result, quizId]);

  // PUBLIC_INTERFACE
  const getScoreColor = (percentage) => {
    /**
     * Get color class based on score percentage
     */
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'danger';
  };

  // PUBLIC_INTERFACE
  const getScoreMessage = (percentage) => {
    /**
     * Get encouraging message based on score
     */
    if (percentage >= 90) return 'Excellent work! Outstanding performance!';
    if (percentage >= 80) return 'Great job! You did really well!';
    if (percentage >= 70) return 'Good work! Nice understanding of the material.';
    if (percentage >= 60) return 'Not bad! Keep studying to improve.';
    return 'Keep practicing! Review the material and try again.';
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading results...</p>
        </div>
      </Layout>
    );
  }

  if (error || !result) {
    return (
      <Layout>
        <div className="card text-center">
          <h2>Results Not Available</h2>
          <p className="text-secondary mb-6">
            {error || 'No quiz results found.'}
          </p>
          <Link to="/quizzes" className="btn btn-primary">
            Back to Quizzes
          </Link>
        </div>
      </Layout>
    );
  }

  const percentage = Math.round((result.score / result.total_questions) * 100);
  const correctAnswers = result.score;
  const totalQuestions = result.total_questions;

  return (
    <Layout>
      <div className="results-header text-center mb-8">
        <h1 className="page-title">Quiz Results</h1>
        <p className="text-secondary">
          {result.quiz_title || 'Quiz Completed'}
        </p>
      </div>

      {/* Score Summary */}
      <div className="card mb-6">
        <div className="text-center">
          <div className={`score-circle ${getScoreColor(percentage)}`}>
            <div className="score-percentage">
              {percentage}%
            </div>
            <div className="score-fraction">
              {correctAnswers}/{totalQuestions}
            </div>
          </div>
          
          <h2 className="mt-4 mb-2">
            {getScoreMessage(percentage)}
          </h2>
          
          <div className="score-stats">
            <div className="stat-item">
              <div className="stat-value text-success">{correctAnswers}</div>
              <div className="stat-label">Correct</div>
            </div>
            <div className="stat-item">
              <div className="stat-value text-danger">{totalQuestions - correctAnswers}</div>
              <div className="stat-label">Incorrect</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{totalQuestions}</div>
              <div className="stat-label">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Question Review */}
      {questions.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Question Review</h3>
            <p className="card-description">
              Review your answers and see the correct solutions
            </p>
          </div>

          <div className="questions-review">
            {questions.map((question, index) => {
              const userAnswerId = userAnswers[question.id];
              const correctOption = question.options?.find(opt => opt.is_correct);
              const userOption = question.options?.find(opt => opt.id === userAnswerId);
              const isCorrect = userAnswerId === correctOption?.id;

              return (
                <div key={question.id} className="question-review-item">
                  <div className="question-review-header">
                    <div className="question-number">
                      Question {index + 1}
                    </div>
                    <div className={`question-result ${isCorrect ? 'correct' : 'incorrect'}`}>
                      {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </div>
                  </div>

                  <h4 className="question-text">{question.question}</h4>

                  <div className="options-review">
                    {question.options?.map((option) => {
                      const isUserAnswer = option.id === userAnswerId;
                      const isCorrectAnswer = option.is_correct;
                      
                      let optionClass = 'option-review';
                      if (isCorrectAnswer) {
                        optionClass += ' correct-answer';
                      } else if (isUserAnswer && !isCorrectAnswer) {
                        optionClass += ' user-incorrect';
                      } else if (isUserAnswer) {
                        optionClass += ' user-correct';
                      }

                      return (
                        <div key={option.id} className={optionClass}>
                          <span className="option-indicator">
                            {isCorrectAnswer && '✓'}
                            {isUserAnswer && !isCorrectAnswer && '✗'}
                            {isUserAnswer && isCorrectAnswer && '✓'}
                          </span>
                          <span className="option-text">{option.text}</span>
                          <span className="option-labels">
                            {isUserAnswer && (
                              <span className="user-label">Your Answer</span>
                            )}
                            {isCorrectAnswer && (
                              <span className="correct-label">Correct Answer</span>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {question.explanation && (
                    <div className="question-explanation">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="results-actions text-center mt-6">
        <Link to="/quizzes" className="btn btn-outline mr-4">
          Take Another Quiz
        </Link>
        <Link to={`/quiz/${quizId}`} className="btn btn-primary">
          Retake This Quiz
        </Link>
      </div>
    </Layout>
  );
};

export default QuizResults;
