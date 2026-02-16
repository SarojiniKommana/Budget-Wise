import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, password, name } = location.state || {};

  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (loading) return; // prevent double clicks
     setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            name,
            password,
          }),
        }
      );
      const data = await response.json();
      setMessage(data.message);

      if (data.message === "OTP verified successfully") {
        setTimeout(() => {
          navigate("/login"); // navigate after 2s
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error verifying OTP");
    }
    finally {
    setLoading(false);
    }

  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Verify Your Email</h2>
        <p>OTP has been sent to <strong>{email}</strong></p>

        {message && <div className={`flash-message ${message.includes("successfully") ? "success" : "error"}`}>{message}</div>}

        <form onSubmit={handleVerify}>
          <label>Enter OTP</label>
          <input
            type="text"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default OtpVerification;
