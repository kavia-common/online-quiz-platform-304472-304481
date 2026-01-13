import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { quizAPI } from '../../services/api';
import Layout from '../../components/layout/Layout';
import QuizModal from '../../components/admin/QuizModal';

// PUBLIC_INTERFACE
const AdminQuizzes = () => {
  /**
   * Admin quiz management page with CRUD operations
   */
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [deletingQuiz, setDeletingQuiz] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // PUBLIC_INTERFACE
  const fetchQuizzes = async () => {
    /**
     * Fetch all quizzes for admin management
     */
    try {
      setLoading(true);
      const response = await quizAPI.getQuizzes();
      setQuizzes(response);
    } catch (error) {
      setError('Failed to load quizzes');
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  // PUBLIC_INTERFACE
  const handleCreateQuiz = () => {
    /**
     * Open modal for creating new quiz
     */
    setEditingQuiz(null);
    setIsModalOpen(true);
  };

  // PUBLIC_INTERFACE
  const handleEditQuiz = (quiz) => {
    /**
     * Open modal for editing existing quiz
     */
    setEditingQuiz(quiz);
    setIsModalOpen(true);
  };

  // PUBLIC_INTERFACE
  const handleDeleteQuiz = async (quizId) => {
    /**
     * Delete quiz with confirmation
     */
    try {
      await quizAPI.deleteQuiz(quizId);
      setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
      setDeletingQuiz(null);
    } catch (error) {
      setError('Failed to delete quiz');
      console.error('Error deleting quiz:', error);
    }
  };

  // PUBLIC_INTERFACE
  const handleSaveQuiz = async (quizData) => {
    /**
     * Save quiz (create or update)
     */
    try {
      if (editingQuiz) {
        // Update existing quiz
        const updatedQuiz = await quizAPI.updateQuiz(editingQuiz.id, quizData);
        setQuizzes(quizzes.map(quiz => 
          quiz.id === editingQuiz.id ? updatedQuiz : quiz
        ));
      } else {
        // Create new quiz
        const newQuiz = await quizAPI.createQuiz(quizData);
        setQuizzes([newQuiz, ...quizzes]);
      }
      setIsModalOpen(false);
      setEditingQuiz(null);
    } catch (error) {
      setError('Failed to save quiz');
      console.error('Error saving quiz:', error);
    }
  };

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

  return (
    <Layout>
      <div className="page-header">
        <h1 className="page-title">Manage Quizzes</h1>
        <div className="page-actions">
          <Link to="/admin/dashboard" className="btn btn-outline">
            ← Back to Dashboard
          </Link>
          <button 
            onClick={handleCreateQuiz}
            className="btn btn-primary"
          >
            Create New Quiz
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          {error}
        </div>
      )}

      {quizzes.length === 0 ? (
        <div className="card text-center">
          <h2>No Quizzes Created</h2>
          <p className="text-secondary mb-6">
            Create your first quiz to get started.
          </p>
          <button 
            onClick={handleCreateQuiz}
            className="btn btn-primary"
          >
            Create First Quiz
          </button>
        </div>
      ) : (
        <div className="admin-quiz-list">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="admin-quiz-card">
              <div className="quiz-info">
                <h3 className="quiz-title">{quiz.title}</h3>
                <p className="quiz-description">{quiz.description}</p>
                
                <div className="quiz-meta">
                  <span className="meta-item">
                    <strong>Questions:</strong> {quiz.questions_count || 0}
                  </span>
                  <span className="meta-item">
                    <strong>Difficulty:</strong> 
                    <span className={`difficulty-badge difficulty-${(quiz.difficulty || 'medium').toLowerCase()}`}>
                      {quiz.difficulty || 'Medium'}
                    </span>
                  </span>
                  {quiz.time_limit && (
                    <span className="meta-item">
                      <strong>Time Limit:</strong> {quiz.time_limit} min
                    </span>
                  )}
                </div>

                <div className="quiz-stats">
                  <span className="stat-item">
                    <strong>Attempts:</strong> {quiz.attempts_count || 0}
                  </span>
                  <span className="stat-item">
                    <strong>Avg Score:</strong> {quiz.average_score || 0}%
                  </span>
                  <span className="stat-item">
                    <strong>Status:</strong> 
                    <span className={`status-badge ${quiz.is_active ? 'active' : 'inactive'}`}>
                      {quiz.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </span>
                </div>
              </div>

              <div className="quiz-actions">
                <Link 
                  to={`/quiz/${quiz.id}`}
                  className="btn btn-outline btn-sm"
                >
                  Preview
                </Link>
                <button 
                  onClick={() => handleEditQuiz(quiz)}
                  className="btn btn-secondary btn-sm"
                >
                  Edit
                </button>
                <button 
                  onClick={() => setDeletingQuiz(quiz)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quiz Create/Edit Modal */}
      {isModalOpen && (
        <QuizModal
          quiz={editingQuiz}
          onSave={handleSaveQuiz}
          onClose={() => {
            setIsModalOpen(false);
            setEditingQuiz(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingQuiz && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Confirm Delete</h3>
              <button 
                className="modal-close"
                onClick={() => setDeletingQuiz(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <p>
                Are you sure you want to delete "{deletingQuiz.title}"? 
                This action cannot be undone and will remove all associated questions and user attempts.
              </p>
            </div>
            
            <div className="modal-actions">
              <button 
                onClick={() => setDeletingQuiz(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteQuiz(deletingQuiz.id)}
                className="btn btn-danger"
              >
                Delete Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminQuizzes;
