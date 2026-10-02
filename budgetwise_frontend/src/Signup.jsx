import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaWallet } from "react-icons/fa";
import { useState } from "react";
import "./Login.css"; // shared auth styles; Signup.css is no longer needed

// Same rule Login, Reset password and Change password already enforce.
const PASSWORD_PATTERN = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&]).{8,}$";
const PASSWORD_HINT =
  "At least 8 characters with a letter, a number and a symbol (@$!%*#?&).";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // prevents multiple clicks

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match. Re-enter them and try again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/generate-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();

      if (
        data.message &&
        data.message.includes("User already exists with this email")
      ) {
        setError("An account with this email already exists. Log in instead.");
      } else if (response.ok) {
        navigate("/otp-verification", { state: { email, name, password } });
      } else {
        setError(data.message || "Error sending OTP");
      }
    } catch (err) {
      console.error(err);
      setError("Couldn't reach the server. Please try again.");
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
        <h2>Create your account</h2>
        <p>We'll email you a code to confirm your address.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="signup-name">Name</label>
          <input
            id="signup-name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            placeholder="Create a password"
            autoComplete="new-password"
            minLength="8"
            pattern={PASSWORD_PATTERN}
            title={PASSWORD_HINT}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="field-hint">{PASSWORD_HINT}</p>

          <label htmlFor="signup-confirm">Confirm password</label>
          <input
            id="signup-confirm"
            type="password"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            minLength="8"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && (
            <p className="error-msg" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Sending code..." : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;