import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function VerifyResetOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const { email } = location.state || {};

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/verify-reset-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        navigate("/reset-password", { state: { email } });
      }
    } catch {
      setMessage("Verification failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Verify OTP</h2>
        <p>OTP sent to {email}</p>

        {message && <p>{message}</p>}

        <form onSubmit={handleVerify}>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            placeholder="Enter OTP"
          />

          <button>Verify</button>
        </form>
      </div>
    </div>
  );
}

export default VerifyResetOtp;
