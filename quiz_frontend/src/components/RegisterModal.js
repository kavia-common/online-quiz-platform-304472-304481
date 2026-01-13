import React, { useState, useContext } from "react";
import { AuthContext } from "../state/AuthContext";

// PUBLIC_INTERFACE
/**
 * Registration modal dialog; calls API and triggers register on success.
 */
function RegisterModal({ onClose }) {
  const { onRegister, setShowLogin } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // If backend is not connected this throws.
      const user = await require("../utils/api").default.auth.register(
        email,
        password,
        name
      );
      onRegister(user);
      onClose();
    } catch (err) {
      setError("Registration failed");
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
        style={{ minWidth: 340, position: "relative" }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleRegister}
      >
        <div className="heading" style={{ marginBottom: 0 }}>
          Register
        </div>
        {error && (
          <div style={{ color: "var(--color-error)", marginBottom: "1em" }}>
            {error}
          </div>
        )}
        <label htmlFor="register-email">Email</label>
        <input
          autoFocus
          id="register-email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="register-name">Name</label>
        <input
          id="register-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <button className="btn" disabled={loading} type="submit" style={{ width: "100%" }}>
          {loading ? "Registering..." : "Register"}
        </button>
        <div style={{ margin: "0.6em 0", textAlign: "center" }}>
          <span
            className="link"
            tabIndex={0}
            role="button"
            onClick={() => {
              onClose();
              setShowLogin(true);
            }}
          >
            Already have an account? Login
          </span>
        </div>
      </form>
    </div>
  );
}

export default RegisterModal;
