import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import "./transactions.css";

export default function Settings() {
  const navigate = useNavigate();

  const name = localStorage.getItem("userName");
  const email = localStorage.getItem("userEmail");

  return (
    <div className="settings-page">

      <h1 className="settings-title">Settings</h1>

      <div className="profile-row">
        <div className="profile-icon">
          <User size={40} />
        </div>

        <div className="profile-info">
          <h2>{name}</h2>
          <p>{email}</p>
        </div>
      </div>

      <hr />

      <button
        className="change-btn"
        onClick={() => navigate("/change-password")}
      >
        Change Password
      </button>

    </div>
  );
}
