import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminQuizList from "./AdminQuizList";
import AdminQuizEdit from "./AdminQuizEdit";

// PUBLIC_INTERFACE
/**
 * AdminDashboard provides navigation for admin quiz and question management.
 */
function AdminDashboard() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AdminQuizList />} />
        <Route path="/quiz/:quizId" element={<AdminQuizEdit />} />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </div>
  );
}

export default AdminDashboard;
