import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./layout.css";
export default function AppLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div className="layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="content" >

        {/* Nested page content renders here */}
        <div className="page">
        <Outlet />
        </div>
      </div>
    </div>
  );
}
