import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const { email } = location.state || {};

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch {
      setMessage("Error resetting password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Set New Password</h2>

        {message && <p>{message}</p>}

        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="New Password"
            required
            value={password}
            pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$"
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirm}
            pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$"
            onChange={(e) => setConfirm(e.target.value)}
          />

          <button>Reset Password</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
