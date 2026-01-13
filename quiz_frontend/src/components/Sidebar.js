import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../state/AuthContext";

// PUBLIC_INTERFACE
/**
 * Sidebar navigation menu, responsive, with Electric Orange accent,
 * shows profile and admin links if logged in.
 */
function Sidebar() {
  const { user, setShowLogin, setShowRegister, logout } =
    useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="logo">⚡ QuizGenie</div>
      <nav>
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
          Quizzes
        </NavLink>
        {!!user && (
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            My Profile
          </NavLink>
        )}
        {!!user && user.isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Admin
          </NavLink>
        )}
        {!user && (
          <>
            <a
              href="#login"
              onClick={() => setShowLogin(true)}
              style={{ marginTop: "2rem" }}
            >
              Login
            </a>
            <a
              href="#register"
              onClick={() => setShowRegister(true)}
              style={{ marginTop: "0.8rem" }}
            >
              Register
            </a>
          </>
        )}
        {!!user && (
          <a
            href="#logout"
            className="logout"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Logout
          </a>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
