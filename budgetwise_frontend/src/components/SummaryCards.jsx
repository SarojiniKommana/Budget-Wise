import { FaArrowDown, FaArrowUp, FaLock, FaWallet } from "react-icons/fa";

export default function SummaryCards({ expenses }) {
  const totalIncome = expenses
  .filter(e => e.type === "Income")
  .reduce((sum, e) => sum + e.amount, 0);

const totalExpense = expenses
  .filter(e => e.type === "Expense" && !Boolean(e.reserved))
  .reduce((sum, e) => sum + e.amount, 0);

const reservedExpense = expenses
  .filter(e => e.type === "Expense" && Boolean(e.reserved))
  .reduce((sum, e) => sum + e.amount, 0);

const availableBalance =
  totalIncome - totalExpense - reservedExpense;
  const income = totalIncome;
  const expense = totalExpense;
  const balance = Math.max(income - expense, 0);

 return (
  <div className="summary-grid">
    <div className="card income">
      <FaArrowDown />
      <h4>Total Income</h4>
      <p>₹{income}</p>
    </div>

    <div className="card expense">
      <FaArrowUp />
      <h4>Total Expense</h4>
      <p>₹{expense}</p>
    </div>

    <div className="card reserved">
      <FaLock />
      <h4>Reserved Expense</h4>
      <p>₹{reservedExpense}</p>
    </div>

    <div className="card balance">
      <FaWallet />
      <h4>Balance</h4>
      <p>₹{availableBalance}</p>
    </div>
  </div>
);

}
