import React from "react";
import "../pages/transactions.css";
import { formatCurrency } from "../utils/format";

export default function RecentTransactions({ transactions }) {
  const latest = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="recent-box">
      <div className="recent-header">
        <h3>Recent Transactions</h3>
        <a href="/dashboard/transactions">View all</a>
      </div>

      <table className="recent-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Reserved</th>
          </tr>
        </thead>

        <tbody>
          {latest.map((t, i) => {
            // Bug fix: t.type is "Income"/"Expense" (capitalized) but this
            // used to compare against lowercase "income", which is never
            // true — every row showed a "-" and the expense color, even
            // for income.
            const isIncome = t.type === "Income";
            return (
              <tr key={t.id ?? i}>
                <td>{t.date}</td>
                <td>{t.category || t.title}</td>
                <td className={isIncome ? "income" : "expense"}>{t.type}</td>
                <td className={isIncome ? "income" : "expense"}>
                  {isIncome ? "+ " : "- "}
                  {formatCurrency(t.amount)}
                </td>
                <td>{t.isReserved ? "Yes" : "No"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}