import React from "react";
import { useState, useEffect, useMemo } from "react";
import BarGraph from "../components/BarGraph.jsx";
import PieChartComponent from "../components/PieChart.jsx";
import { formatCurrency } from "../utils/format";
import "./transactions.css";

const PERIODS = {
  thisMonth: "This month",
  lastMonth: "Last month",
  last3Months: "Last 3 months",
  allTime: "All time",
};

function inPeriod(dateStr, period) {
  if (period === "allTime") return true;
  const date = new Date(dateStr);
  const now = new Date();
  if (period === "thisMonth") {
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }
  if (period === "lastMonth") {
    const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return date.getFullYear() === last.getFullYear() && date.getMonth() === last.getMonth();
  }
  if (period === "last3Months") {
    const cutoff = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    return date >= cutoff;
  }
  return true;
}

export default function Analytics() {
  const [transactions, setTransactions] = useState([]);
  const [period, setPeriod] = useState("thisMonth");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");

    fetch(`http://localhost:8080/api/transactions?email=${email}`)
      .then((res) => res.json())
      .then((data) => setTransactions(data))
      .catch((err) => {
        console.error("Failed to fetch transactions:", err);
        setTransactions([]);
      });
  }, []);

  const filtered = useMemo(
    () => transactions.filter((t) => t.date && inPeriod(t.date, period)),
    [transactions, period]
  );

  const totalIncome = filtered
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filtered
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div>
          <h1>Analytics</h1>
          <p>
            {formatCurrency(totalIncome)} income, {formatCurrency(totalExpense)} expense —{" "}
            {PERIODS[period].toLowerCase()}
          </p>
        </div>

        <select
          className="period-select"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          {Object.entries(PERIODS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="analytics-grid">
        <div className="chart-card">
          <h3>Expenses by category</h3>
          <BarGraph transactions={filtered} />
        </div>

        <div className="chart-card">
          <h3>Income vs expense</h3>
          <PieChartComponent transactions={filtered} />
        </div>
      </div>
    </div>
  );
}