import axios from 'axios';

// Get API base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// PUBLIC_INTERFACE
export const authAPI = {
  /**
   * Login user with email and password
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Register new user
   */
  signup: async (email, password, name) => {
    const response = await api.post('/auth/signup', { email, password, name });
    return response.data;
  },

  /**
   * Logout current user
   */
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// PUBLIC_INTERFACE
export const quizAPI = {
  /**
   * Get all quizzes
   */
  getQuizzes: async () => {
    const response = await api.get('/quizzes');
    return response.data;
  },

  /**
   * Get quiz by ID
   */
  getQuiz: async (quizId) => {
    const response = await api.get(`/quizzes/${quizId}`);
    return response.data;
  },

  /**
   * Create new quiz (admin only)
   */
  createQuiz: async (quizData) => {
    const response = await api.post('/quizzes', quizData);
    return response.data;
  },

  /**
   * Update quiz (admin only)
   */
  updateQuiz: async (quizId, quizData) => {
    const response = await api.put(`/quizzes/${quizId}`, quizData);
    return response.data;
  },

  /**
   * Delete quiz (admin only)
   */
  deleteQuiz: async (quizId) => {
    await api.delete(`/quizzes/${quizId}`);
  },

  /**
   * Submit quiz answers
   */
  submitQuiz: async (quizId, answers) => {
    const response = await api.post(`/quizzes/${quizId}/submit`, { answers });
    return response.data;
  },

  /**
   * Get user's quiz attempts
   */
  getMyAttempts: async () => {
    const response = await api.get('/quizzes/attempts');
    return response.data;
  },

  /**
   * Get quiz attempt details
   */
  getAttemptDetails: async (attemptId) => {
    const response = await api.get(`/quizzes/attempts/${attemptId}`);
    return response.data;
  },
};

// PUBLIC_INTERFACE
export const questionsAPI = {
  /**
   * Get questions for a quiz
   */
  getQuizQuestions: async (quizId) => {
    const response = await api.get(`/quizzes/${quizId}/questions`);
    return response.data;
  },

  /**
   * Create new question (admin only)
   */
  createQuestion: async (quizId, questionData) => {
    const response = await api.post(`/quizzes/${quizId}/questions`, questionData);
    return response.data;
  },

  /**
   * Update question (admin only)
   */
  updateQuestion: async (questionId, questionData) => {
    const response = await api.put(`/questions/${questionId}`, questionData);
    return response.data;
  },

  /**
   * Delete question (admin only)
   */
  deleteQuestion: async (questionId) => {
    await api.delete(`/questions/${questionId}`);
  },
};

export default api;
