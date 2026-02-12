
import "../layouts/layout.css";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaExchangeAlt,
  FaChartPie,
  FaCog,
  FaWallet,
  FaSignOutAlt
} from "react-icons/fa";


export default function Sidebar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };
  return (
    <div className="sidebar">
      <div className="brand">
        <FaWallet />
        <span>BudgetWise</span>
      </div>

      <nav>
        <NavLink to="/dashboard" end>
          <FaHome /> Dashboard
        </NavLink>

        <NavLink to="/dashboard/transactions">
          <FaExchangeAlt /> Transactions
        </NavLink>

        <NavLink to="/dashboard/analytics">
          <FaChartPie /> Analytics
        </NavLink>

        <NavLink to="/dashboard/settings">
          <FaCog /> Settings
        </NavLink>
        <div className="sidebar-link logout-link" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </div>
      </nav>
    </div>
  );
}
