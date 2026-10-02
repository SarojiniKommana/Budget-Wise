import React from "react";
import { Link } from "react-router-dom";
import {
  FaWallet,
  FaHome,
  FaExchangeAlt,
  FaChartPie,
  FaRobot,
  FaLock,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { formatCurrency } from "./utils/format";
import "./Home.css";

/*
  Home.css relies on the design tokens declared in layouts/layout.css
  (--ink, --muted, --border, --income, ...). App.jsx imports AppLayout,
  so they are loaded on every route including this one.
*/

// Sample data for the hero preview. Totals use the same rules as
// components/SummaryCards.jsx so the preview always adds up.
const SAMPLE = [
  { category: "Salary", type: "Income", amount: 85000, isReserved: false, date: "01 Sep" },
  { category: "Rent", type: "Expense", amount: 14000, isReserved: false, date: "03 Sep" },
  { category: "Transport", type: "Expense", amount: 6500, isReserved: false, date: "12 Sep" },
  { category: "Groceries", type: "Expense", amount: 9250, isReserved: false, date: "21 Sep" },
  { category: "Travel fund", type: "Expense", amount: 7000, isReserved: true, date: "24 Sep" },
];

const sum = (rows) => rows.reduce((total, r) => total + r.amount, 0);
const income = sum(SAMPLE.filter((t) => t.type === "Income"));
const expense = sum(SAMPLE.filter((t) => t.type === "Expense" && !t.isReserved));
const reserved = sum(SAMPLE.filter((t) => t.type === "Expense" && t.isReserved));
const balance = income - expense - reserved;
const recent = [...SAMPLE].reverse().slice(0, 4);

const FEATURES = [
  {
    icon: <FaExchangeAlt />,
    title: "Log every rupee in seconds",
    text: "Add income and expenses with a category and date. Edit or delete them any time.",
  },
  {
    icon: <FaLock />,
    title: "Set money aside",
    text: "Mark an expense as reserved and it leaves your balance, so rent and emergency funds stay untouched.",
  },
  {
    icon: <FaChartPie />,
    title: "See where it goes",
    text: "Pie and bar charts break your spending down by category and by month.",
  },
  {
    icon: <FaRobot />,
    title: "Ask your own data",
    text: "AI compares each category with last month, suggests where to save, and answers questions about your spending.",
  },
];

const STEPS = [
  { title: "Create your account", text: "Sign up and confirm your email with a one-time code." },
  { title: "Add your transactions", text: "Enter income and expenses, and reserve what you don't want to spend." },
  { title: "Read your insights", text: "Open Analytics and AI Insights to see what changed and what to cut." },
];

function DashboardPreview() {
  return (
    <div className="preview" aria-hidden="true">
      <div className="preview-side">
        <div className="preview-brand">
          <FaWallet /> BudgetWise
        </div>
        <span className="preview-nav active"><FaHome /> Dashboard</span>
        <span className="preview-nav"><FaExchangeAlt /> Transactions</span>
        <span className="preview-nav"><FaChartPie /> Analytics</span>
        <span className="preview-nav"><FaRobot /> AI Insights</span>
      </div>

      <div className="preview-main">
        <p className="preview-label">Balance</p>
        <p className="preview-balance">{formatCurrency(balance)}</p>

        <div className="preview-stats">
          <div className="stat income">
            <span className="stat-label"><FaArrowUp /> Income</span>
            <span className="stat-value">{formatCurrency(income)}</span>
          </div>
          <div className="stat expense">
            <span className="stat-label"><FaArrowDown /> Expense</span>
            <span className="stat-value">{formatCurrency(expense)}</span>
          </div>
          <div className="stat reserved">
            <span className="stat-label"><FaLock /> Reserved</span>
            <span className="stat-value">{formatCurrency(reserved)}</span>
          </div>
        </div>

        <ul className="preview-rows">
          {recent.map((t) => {
            const isIncome = t.type === "Income";
            return (
              <li key={t.category}>
                <span className="preview-date">{t.date}</span>
                <span className="preview-cat">
                  {t.category}
                  {t.isReserved && <FaLock className="preview-lock" />}
                </span>
                <span className={isIncome ? "income" : "expense"}>
                  {isIncome ? "+ " : "- "}
                  {formatCurrency(t.amount)}
                </span>
              </li>
            );
          })}
        </ul>

        <p className="preview-insight">
          <FaRobot /> Groceries are 12% higher than last month.
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  return (
    <div className="home">
      <header className="home-header">
        <Link to="/" className="home-brand">
          <FaWallet /> BudgetWise
        </Link>

        <nav className="home-nav" aria-label="Primary">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
        </nav>

        <div className="home-header-actions">
          {isLoggedIn ? (
            <Link to="/dashboard" className="btn btn-solid">Open dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-text">Log in</Link>
              <Link to="/signup" className="btn btn-solid">Get started</Link>
            </>
          )}
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <h1>Your money, accounted for.</h1>
            <p>
              Track income and expenses, reserve funds for what's coming, and let
              AI show you where your spending is drifting.
            </p>
            <div className="hero-actions">
              <Link to={isLoggedIn ? "/dashboard" : "/signup"} className="btn btn-solid btn-lg">
                {isLoggedIn ? "Open dashboard" : "Create your account"}
              </Link>
              {!isLoggedIn && (
                <Link to="/login" className="btn btn-outline btn-lg">Log in</Link>
              )}
            </div>
          </div>

          <DashboardPreview />
        </section>

        <section className="section" id="features">
          <h2>Everything the dashboard does, in one place</h2>
          <div className="feature-list">
            {FEATURES.map((f) => (
              <article className="feature" key={f.title}>
                <span className="feature-icon">{f.icon}</span>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="how-it-works">
          <h2>Up and running in three steps</h2>
          <ol className="steps">
            {STEPS.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {!isLoggedIn && (
          <section className="cta">
            <h2>See your month clearly</h2>
            <p>Create an account and add your first transaction in under a minute.</p>
            <Link to="/signup" className="btn btn-light btn-lg">Create your account</Link>
          </section>
        )}
      </main>

      <footer className="home-footer">
        <span className="home-brand"><FaWallet /> BudgetWise</span>
        <span>AI-powered expense and budget tracker</span>
      </footer>
    </div>
  );
}