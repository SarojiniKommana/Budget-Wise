import { useState } from "react";
import SummaryCards from "../components/SummaryCards";
import { useEffect } from "react";
import RecentTransactions from "../components/RecentTransactions";

export default function Dashboard() {
  const name = localStorage.getItem("userName");
  const [transactions, setTransactions] = useState([]);
  
  // Example expenses data (can be fetched later)
  
 useEffect(() => {
  const email = localStorage.getItem("userEmail");
  fetch(`http://localhost:8080/api/transactions?email=${email}`)
    .then(res => res.json())
    .then(data => {
      // Convert isReserved to boolean for all transactions
      const normalized = data.map(t => ({
        ...t,
        isReserved: t.isReserved === true || t.isReserved === "true" || t.isReserved === 1
      }));
      setTransactions(normalized);
    })
    .catch(err => {
      console.error("Failed to fetch transactions:", err);
      setTransactions([]);
    });
}, []);


  return (
    <div className="dashboard-container">
      <div className="welcome-box">
      <h2>Welcome, {name} 👋</h2>
      <p>Here is an overview of your expenses</p>
    </div>
      <SummaryCards expenses={transactions} />
      <RecentTransactions transactions={transactions} />
      
    </div>
  );
}
