import { BrowserRouter,Routes,Route} from "react-router-dom"
import Login from "./login.jsx"
import Signup from "./Signup.jsx"
import Home from "./Home.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import OtpVerification from "./OtpVerfication.jsx"
import ForgotPassword from "./pages/ForgotPassword.jsx";
import VerifyResetOtp from "./pages/VerifyResetOtp.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import Transactions from "./pages/Transactions.jsx";
import Analytics from "./pages/Analytics.jsx";
import Settings from "./pages/Settings.jsx";
import ChangePassword from "./pages/ChangePassword";



function App() {
  
  return (
   <BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/otp-verification" element={<OtpVerification />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/change-password" element={<ChangePassword />} />
    {/* ✅ DASHBOARD LAYOUT WRAPPER */}
    <Route path="/dashboard" element={<AppLayout />}>
      {/* default page after login */}
      <Route index element={<Dashboard />} />
      
      <Route path="transactions" element={<Transactions />} />

      <Route path="settings" element={<Settings />} />
      <Route path="analytics" element={<Analytics />} />
      
      
      {/* sidebar pages */}
      
    </Route>
  </Routes>
</BrowserRouter>

  )
}

export default App
