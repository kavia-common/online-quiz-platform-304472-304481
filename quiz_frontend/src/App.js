import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './pages/Dashboard';
import QuizList from './pages/QuizList';
import TakeQuiz from './pages/TakeQuiz';
import QuizResults from './pages/QuizResults';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminQuizzes from './pages/admin/AdminQuizzes';
import './App.css';

// PUBLIC_INTERFACE
function App() {
  /**
   * Main application component with routing and authentication setup
   */
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quizzes" 
              element={
                <ProtectedRoute>
                  <QuizList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quiz/:quizId" 
              element={
                <ProtectedRoute>
                  <TakeQuiz />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quiz/:quizId/result" 
              element={
                <ProtectedRoute>
                  <QuizResults />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin routes */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/quizzes" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminQuizzes />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
