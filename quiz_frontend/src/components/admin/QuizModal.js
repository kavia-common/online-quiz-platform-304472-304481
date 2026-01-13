import React, { useState, useEffect } from 'react';

// PUBLIC_INTERFACE
const QuizModal = ({ quiz, onSave, onClose }) => {
  /**
   * Modal component for creating and editing quizzes
   */
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'medium',
    time_limit: '',
    is_active: true,
    questions: []
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (quiz) {
      setFormData({
        title: quiz.title || '',
        description: quiz.description || '',
        difficulty: quiz.difficulty || 'medium',
        time_limit: quiz.time_limit || '',
        is_active: quiz.is_active !== false,
        questions: quiz.questions || []
      });
    }
  }, [quiz]);

  // PUBLIC_INTERFACE
  const validateForm = () => {
    /**
     * Validate quiz form data
     */
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.time_limit && (isNaN(formData.time_limit) || formData.time_limit < 1)) {
      newErrors.time_limit = 'Time limit must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // PUBLIC_INTERFACE
  const handleChange = (e) => {
    /**
     * Handle form input changes
     */
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // PUBLIC_INTERFACE
  const handleSubmit = async (e) => {
    /**
     * Handle form submission
     */
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const quizData = {
        ...formData,
        time_limit: formData.time_limit ? parseInt(formData.time_limit) : null
      };
      await onSave(quizData);
    } catch (error) {
      console.error('Error saving quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal modal-large">
        <div className="modal-header">
          <h3 className="modal-title">
            {quiz ? 'Edit Quiz' : 'Create New Quiz'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-content">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Quiz Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className={`form-input ${errors.title ? 'error' : ''}`}
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter quiz title"
                required
              />
              {errors.title && (
                <span className="form-error">{errors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what this quiz covers"
                rows={3}
                required
              />
              {errors.description && (
                <span className="form-error">{errors.description}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="difficulty" className="form-label">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  className="form-select"
                  value={formData.difficulty}
                  onChange={handleChange}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="time_limit" className="form-label">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  id="time_limit"
                  name="time_limit"
                  className={`form-input ${errors.time_limit ? 'error' : ''}`}
                  value={formData.time_limit}
                  onChange={handleChange}
                  placeholder="Optional"
                  min="1"
                />
                {errors.time_limit && (
                  <span className="form-error">{errors.time_limit}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-checkbox">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />
                <span className="checkbox-label">
                  Active (visible to users)
                </span>
              </label>
            </div>

            <div className="form-note">
              <p className="text-secondary">
                <strong>Note:</strong> After creating the quiz, you can add questions 
                by editing the quiz and using the question management interface.
              </p>
            </div>
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              onClick={onClose}
              className="btn btn-outline"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner-small"></div>
                  Saving...
                </>
              ) : (
                quiz ? 'Update Quiz' : 'Create Quiz'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizModal;
