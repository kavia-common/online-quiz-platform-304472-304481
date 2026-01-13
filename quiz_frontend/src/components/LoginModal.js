import React, { useState, useContext } from "react";
import { AuthContext } from "../state/AuthContext";

// PUBLIC_INTERFACE
/**
 * Login modal dialog; calls API and triggers login on success.
 */
function LoginModal({ onClose }) {
  const { onLogin, setShowRegister } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // If backend is not connected this throws.
      const user = await require("../utils/api").default.auth.login(
        email,
        password
      );
      onLogin(user);
      onClose();
    } catch (err) {
      setError("Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 100,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(24,26,34,0.86)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={onClose}
    >
      <form
        className="card"
        style={{ minWidth: 330, position: "relative" }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleLogin}
      >
        <div className="heading" style={{ marginBottom: 0 }}>
          Login
        </div>
        {error && (
          <div style={{ color: "var(--color-error)", marginBottom: "1em" }}>
            {error}
          </div>
        )}
        <label htmlFor="login-email">Email</label>
        <input
          autoFocus
          id="login-email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="btn" disabled={loading} type="submit" style={{ width: "100%" }}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <div style={{ margin: "0.6em 0", textAlign: "center" }}>
          <span
            className="link"
            tabIndex={0}
            role="button"
            onClick={() => {
              onClose();
              setShowRegister(true);
            }}
          >
            Need an account? Register
          </span>
        </div>
      </form>
    </div>
  );
}

export default LoginModal;
