import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { formatCurrency } from "../utils/format";

export default function TransactionTable({ transactions, onEdit, onDelete, confirmDeleteId }) {
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Title/Category</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t) => {
            const isIncome = t.type === "Income";
            return (
              <tr key={t.id}>
                <td>{t.date}</td>
                <td className={isIncome ? "income" : "expense"}>{t.type}</td>
                <td>{t.title || t.category}</td>
                <td className={isIncome ? "income" : "expense"}>
                  {isIncome ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </td>
                <td className="actions-cell">
                  <FaEdit onClick={() => onEdit(t)} title="Edit" />
                  {confirmDeleteId === t.id ? (
                    <button className="confirm-delete-btn" onClick={() => onDelete(t.id)}>
                      Confirm?
                    </button>
                  ) : (
                    <FaTrash onClick={() => onDelete(t.id)} title="Delete" />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}