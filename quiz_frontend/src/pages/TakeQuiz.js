import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI, questionsAPI } from '../services/api';
import Layout from '../components/layout/Layout';

// PUBLIC_INTERFACE
const TakeQuiz = () => {
  /**
   * Quiz taking page with questions and timer
   */
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // PUBLIC_INTERFACE
    const fetchQuizData = async () => {
      /**
       * Fetch quiz and questions data
       */
      try {
        const [quizResponse, questionsResponse] = await Promise.all([
          quizAPI.getQuiz(quizId),
          questionsAPI.getQuizQuestions(quizId)
        ]);

        setQuiz(quizResponse);
        setQuestions(questionsResponse);
        
        if (quizResponse.time_limit) {
          setTimeLeft(quizResponse.time_limit * 60); // Convert minutes to seconds
        }
      } catch (error) {
        setError('Failed to load quiz');
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [quizId]);

  // Timer effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // PUBLIC_INTERFACE
  const handleAnswerChange = (questionId, answerId) => {
    /**
     * Handle answer selection for a question
     */
    setAnswers({
      ...answers,
      [questionId]: answerId
    });
  };

  // PUBLIC_INTERFACE
  const handleNext = () => {
    /**
     * Move to next question
     */
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // PUBLIC_INTERFACE
  const handlePrevious = () => {
    /**
     * Move to previous question
     */
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async () => {
    /**
     * Submit quiz answers
     */
    try {
      setSubmitting(true);
      const result = await quizAPI.submitQuiz(quizId, answers);
      navigate(`/quiz/${quizId}/result`, { 
        state: { result, questions, answers } 
      });
    } catch (error) {
      setError('Failed to submit quiz');
      console.error('Error submitting quiz:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // PUBLIC_INTERFACE
  const formatTime = (seconds) => {
    /**
     * Format seconds to MM:SS
     */
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading quiz...</p>
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

  if (!quiz || questions.length === 0) {
    return (
      <Layout>
        <div className="card text-center">
          <h2>Quiz Not Found</h2>
          <p className="text-secondary">
            This quiz is not available or has no questions.
          </p>
        </div>
      </Layout>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Layout>
      <div className="quiz-header">
        <div className="quiz-info">
          <h1 className="quiz-title">{quiz.title}</h1>
          <p className="quiz-progress">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>
        
        {timeLeft !== null && (
          <div className={`quiz-timer ${timeLeft < 300 ? 'warning' : ''}`}>
            <span className="timer-icon">⏱️</span>
            Time: {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="question-container">
        <div className="question-header">
          <h2 className="question-title">{question.question}</h2>
          <div className="question-meta">
            <span className="question-type">
              {question.type === 'multiple_choice' ? 'Multiple Choice' : 'Single Choice'}
            </span>
            {question.points && (
              <span className="question-points">{question.points} points</span>
            )}
          </div>
        </div>

        <div className="options-container">
          {question.options?.map((option) => (
            <label key={option.id} className={`option ${answers[question.id] === option.id ? 'selected' : ''}`}>
              <input
                type="radio"
                name={`question_${question.id}`}
                value={option.id}
                checked={answers[question.id] === option.id}
                onChange={() => handleAnswerChange(question.id, option.id)}
                className="option-radio"
              />
              <span className="option-text">{option.text}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="quiz-navigation">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="btn btn-outline"
        >
          Previous
        </button>

        <div className="quiz-actions">
          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn btn-primary"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TakeQuiz;
