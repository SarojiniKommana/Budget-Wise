import { Link } from "react-router-dom";
import "./Home.css";
import heroImg from "./assets/fimg.png";

export default function Home() {
  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <h2>AI Expense Budget Tracker</h2>
        <Link to="/login" className="login-btn">Login</Link>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Smarter Way to Manage Your Money</h1>
          <p>
            Track income, control expenses, manage reserved funds and
            get AI-powered insights — all in one dashboard.
          </p>

          <div className="hero-actions">
            <Link to="/signup" className="primary-btn">Get Started</Link>
           
          </div>
        </div>

        <div className="hero-image">
          <img src={heroImg} alt="AI Finance Dashboard" />
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="feature-card">
          🤖 <h4>AI Spending Analysis</h4>
          <p>Understand where your money goes with smart insights.</p>
        </div>

        <div className="feature-card">
          📊 <h4>Visual Reports</h4>
          <p>Beautiful charts to track income & expenses easily.</p>
        </div>

        <div className="feature-card">
          🔒 <h4>Reserved Funds</h4>
          <p>Lock money for future goals and emergencies.</p>
        </div>

        <div className="feature-card">
          💰 <h4>Smart Budgeting</h4>
          <p>Plan monthly budgets and avoid overspending.</p>
        </div>
      </section>
    </div>
  );
}
