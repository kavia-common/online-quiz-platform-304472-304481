/**
 * Lightweight API client for backend calls.
 * Tries REACT_APP_API_BASE, then REACT_APP_BACKEND_URL; stubs otherwise (TODO).
 */
const API_BASE =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_BACKEND_URL ||
  "http://localhost:8000"; // fallback for development

const fetchJSON = async (url, opts = {}) => {
  const resp = await fetch(url, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
    credentials: "include", // for session cookies
  });
  if (!resp.ok) throw new Error(await resp.text());
  return resp.json();
};

const api = {
  auth: {
    /**
     * PUBLIC_INTERFACE
     * Login API call
     */
    login: (email, password) =>
      fetchJSON(`${API_BASE}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    /**
     * PUBLIC_INTERFACE
     * Register API call
     */
    register: (email, password, name) =>
      fetchJSON(`${API_BASE}/auth/register`, {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
      }),
    /**
     * PUBLIC_INTERFACE
     * Logout
     */
    logout: () =>
      fetchJSON(`${API_BASE}/auth/logout`, {
        method: "POST",
      }),
    /**
     * PUBLIC_INTERFACE
     * Get current user profile
     */
    getProfile: () =>
      fetchJSON(`${API_BASE}/auth/profile`, {
        method: "GET",
      }),
  },
  quizzes: {
    /**
     * PUBLIC_INTERFACE
     * Get all quizzes (list)
     */
    list: () => fetchJSON(`${API_BASE}/quizzes`, { method: "GET" }),
    /**
     * PUBLIC_INTERFACE
     * Get quiz detail with questions
     */
    get: (quizId) =>
      fetchJSON(`${API_BASE}/quizzes/${quizId}`, { method: "GET" }),
    /**
     * PUBLIC_INTERFACE
     * Submit quiz answers and get results
     */
    submit: (quizId, answers) =>
      fetchJSON(`${API_BASE}/quizzes/${quizId}/submit`, {
        method: "POST",
        body: JSON.stringify({ answers }),
      }),
    /**
     * PUBLIC_INTERFACE
     * Get results for a completed quiz
     */
    getResult: (resultId) =>
      fetchJSON(`${API_BASE}/results/${resultId}`, {
        method: "GET",
      }),
  },
  admin: {
    /**
     * PUBLIC_INTERFACE
     * Admin: get all quizzes
     */
    listQuizzes: () => fetchJSON(`${API_BASE}/admin/quizzes`, { method: "GET" }),
    /**
     * PUBLIC_INTERFACE
     * Admin: create a new quiz
     */
    createQuiz: (quiz) =>
      fetchJSON(`${API_BASE}/admin/quizzes`, {
        method: "POST",
        body: JSON.stringify(quiz),
      }),
    /**
     * PUBLIC_INTERFACE
     * Admin: update quiz
     */
    updateQuiz: (quizId, quiz) =>
      fetchJSON(`${API_BASE}/admin/quizzes/${quizId}`, {
        method: "PUT",
        body: JSON.stringify(quiz),
      }),
    /**
     * PUBLIC_INTERFACE
     * Admin: delete quiz
     */
    deleteQuiz: (quizId) =>
      fetchJSON(`${API_BASE}/admin/quizzes/${quizId}`, {
        method: "DELETE",
      }),
    /**
     * PUBLIC_INTERFACE
     * Admin: get quiz questions
     */
    getQuestions: (quizId) =>
      fetchJSON(`${API_BASE}/admin/quizzes/${quizId}/questions`, {
        method: "GET",
      }),
    /**
     * PUBLIC_INTERFACE
     * Admin: create question
     */
    createQuestion: (quizId, question) =>
      fetchJSON(`${API_BASE}/admin/quizzes/${quizId}/questions`, {
        method: "POST",
        body: JSON.stringify(question),
      }),
    /**
     * PUBLIC_INTERFACE
     * Admin: update question
     */
    updateQuestion: (quizId, questionId, question) =>
      fetchJSON(`${API_BASE}/admin/quizzes/${quizId}/questions/${questionId}`, {
        method: "PUT",
        body: JSON.stringify(question),
      }),
    /**
     * PUBLIC_INTERFACE
     * Admin: delete question
     */
    deleteQuestion: (quizId, questionId) =>
      fetchJSON(`${API_BASE}/admin/quizzes/${quizId}/questions/${questionId}`, {
        method: "DELETE",
      }),
  },
  user: {
    /**
     * PUBLIC_INTERFACE
     * Get user profile
     */
    get: () => fetchJSON(`${API_BASE}/user/profile`, { method: "GET" }),
    /**
     * PUBLIC_INTERFACE
     * Update user profile
     */
    update: (profile) =>
      fetchJSON(`${API_BASE}/user/profile`, {
        method: "PUT",
        body: JSON.stringify(profile),
      }),
  },
  // Add additional stubs/TODOs if backend endpoint not available
};

export default api;
