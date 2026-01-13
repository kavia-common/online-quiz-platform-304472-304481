import React, { useContext } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LoginModal from "./components/LoginModal";
import RegisterModal from "./components/RegisterModal";
import { AuthContext } from "./state/AuthContext";
import QuizList from "./components/QuizList";
import QuizPage from "./components/QuizPage";
import ResultsPage from "./components/ResultsPage";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserProfile from "./components/UserProfile";

function ProtectedRoute({ adminOnly }) {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/" />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/" />;
  return <Outlet />;
}

function App() {
  const { showLogin, setShowLogin, showRegister, setShowRegister } =
    useContext(AuthContext);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<QuizList />} />
          <Route path="/quiz/:quizId" element={<QuizPage />} />
          <Route path="/result/:resultId" element={<ResultsPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<UserProfile />} />
          </Route>
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && (
        <RegisterModal onClose={() => setShowRegister(false)} />
      )}
    </div>
  );
}

export default App;
