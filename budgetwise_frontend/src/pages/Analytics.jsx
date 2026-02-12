import { useState, useEffect } from "react";
import BarGraph from "../components/BarGraph.jsx";
import PieChartComponent from "../components/PieChart.jsx"; // renamed to avoid conflict with recharts PieChart
import "./transactions.css"
export default function Analytics() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");

    fetch(`http://localhost:8080/api/transactions?email=${email}`)
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => {
        console.error("Failed to fetch transactions:", err);
        setTransactions([]);
      });
  }, []);

  return (
    <div className="analytics-page">

      {/* Header */}
      <div className="analytics-header">
        <h1>Analytics</h1>
        <p>Visual overview of your income and expenses</p>
      </div>

      {/* Charts */}
      <div className="analytics-grid">
        <div className="chart-card">
          <h3>Expenses by Category</h3>
          <BarGraph transactions={transactions} />
        </div>

        <div className="chart-card">
          <h3>Income vs Expense</h3>
          <PieChartComponent transactions={transactions} />
        </div>
      </div>

    </div>
  );
}
