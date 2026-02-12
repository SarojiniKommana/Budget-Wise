import {Link, useNavigate} from 'react-router-dom'
import "./login.css"
import { useState } from 'react';
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError('');
    setLoading(true);
// prevent page reload
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      let data = {};
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

   console.log("Backend response:", data);

      if (response.ok && data.message === 'Login successful') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem("userName", data.name); 
        localStorage.setItem("userEmail", data.email);
        navigate('/dashboard');
        
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch(err) {
      console.error(err);
      setError('Error logging in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

    return (
  <div className="login-page">
    <div className="login-card">
      <h2 className="login-title">AI Expense Budget Tracker</h2>
      <p className="login-subtitle">
        Smartly track income & expenses
      </p>

      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          placeholder="you@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength="8"
          pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$"
          required
        />

        <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
      </form>
        <p className="signup-text">
          Don’t have an account?
          <Link to="/signup"> Sign Up</Link>
        </p>
         <Link to="/forgot-password" className="forgot-link">
      Forgot Password?
        </Link>

        {error && <p className="error-msg">{error}</p>}
        {success && (
          <p className="success-msg">✅ Login Successful!</p>
        )}
      
    </div>
  </div>
);

}
export default Login;