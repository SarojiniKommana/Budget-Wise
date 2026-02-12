import { useState } from "react";
import { FaLock } from "react-icons/fa";
import "./transactions.css"

export default function ChangePassword() {
  const email = localStorage.getItem("userEmail");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:8080/api/auth/change-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            oldPassword,
            newPassword,
          }),
        }
      );

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setOldPassword("");
        setNewPassword("");
        setConfirm("");
      }
    } catch {
      setMessage("Something went wrong");
    }
  };

  return (
  <div className="change-wrapper">

    <div className="change-card">

      <div className="change-header">
        <div className="icon-circle">
          <FaLock />
        </div>
        <h2>Change Password</h2>
        <p>Keep your account secure</p>
      </div>

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit} className="change-form">

        <input
          type="password"
          placeholder="Old Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$"
          required
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$"
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$"
          required
        />

        <button type="submit">
          Update Password
        </button>

      </form>
    </div>

  </div>
);

}
