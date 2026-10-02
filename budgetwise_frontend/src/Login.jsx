import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaWallet } from "react-icons/fa";
import "./Login.css"; // was "./login.css" — filename is Login.css, which breaks on case-sensitive systems
import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // prevent page reload
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data = {};
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      }

      if (response.ok && data.message === "Login successful") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", data.name);
        localStorage.setItem("userEmail", data.email);
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      setError("Error logging in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Link to="/" className="auth-brand">
        <FaWallet /> BudgetWise
      </Link>

      <div className="login-card">
        <h2>Log in</h2>
        <p>Pick up where you left off.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="field-row">
            <label htmlFor="login-password">Password</label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>
          <input
            id="login-password"
            type="password"
            placeholder="Your password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength="8"
            pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$"
            title="At least 8 characters with a letter, a number and a symbol (@$!%*#?&)"
            required
          />

          {error && (
            <p className="error-msg" role="alert">
              {error}
            </p>
          )}
          {success && <p className="success-msg">Login successful.</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="auth-switch">
          New to BudgetWise? <Link to="/signup">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;