import React from "react";
import { FaArrowUp, FaArrowDown, FaLock } from "react-icons/fa";
import { formatCurrency } from "../utils/format";

export default function SummaryCards({ expenses }) {
  // Bug fix: the model field is `isReserved`, not `reserved` — the old code
  // filtered on `e.reserved`, which is always undefined, so every expense
  // fell into the "not reserved" bucket regardless of its actual value.
  const totalIncome = expenses
    .filter((e) => e.type === "Income")
    .reduce((sum, e) => sum + e.amount, 0);

  const totalExpense = expenses
    .filter((e) => e.type === "Expense" && !e.isReserved)
    .reduce((sum, e) => sum + e.amount, 0);

  const reservedExpense = expenses
    .filter((e) => e.type === "Expense" && e.isReserved)
    .reduce((sum, e) => sum + e.amount, 0);

  // Bug fix: the old code computed this correctly, then threw it away and
  // rendered a different, simpler (and wrong) number instead.
  const availableBalance = totalIncome - totalExpense - reservedExpense;

  return (
    <div className="summary-grid">
      <p className="balance-label">Balance</p>
      <p className="balance-figure">{formatCurrency(availableBalance)}</p>

      <div className="stat-row">
        <div className="stat income">
          <span className="stat-label">
            <FaArrowUp /> Income
          </span>
          <span className="stat-value">{formatCurrency(totalIncome)}</span>
        </div>

        <div className="stat expense">
          <span className="stat-label">
            <FaArrowDown /> Expense
          </span>
          <span className="stat-value">{formatCurrency(totalExpense)}</span>
        </div>

        <div className="stat reserved">
          <span className="stat-label">
            <FaLock /> Reserved
          </span>
          <span className="stat-value">{formatCurrency(reservedExpense)}</span>
        </div>
      </div>
    </div>
  );
}