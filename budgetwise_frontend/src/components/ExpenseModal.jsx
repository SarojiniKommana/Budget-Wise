import React from "react";
import { useState } from "react";

const CATEGORIES = [
  "Food",
  "Groceries",
  "Rent",
  "Utilities",
  "Travel",
  "Health",
  "Entertainment",
  "Shopping",
  "Other",
];

export default function ExpenseModal({ transaction, onClose, onSave }) {
  const today = new Date().toISOString().split("T")[0];
  const startingIsCustom = transaction && !CATEGORIES.includes(transaction.title);

  const [category, setCategory] = useState(
    startingIsCustom ? "Other" : transaction?.title || "Food"
  );
  const [customCategory, setCustomCategory] = useState(startingIsCustom ? transaction.title : "");
  const [amount, setAmount] = useState(transaction?.amount ?? "");
  const [isReserved, setIsReserved] = useState(transaction?.isReserved ?? false);
  const [date, setDate] = useState(transaction?.date || today);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    const finalCategory = category === "Other" ? customCategory.trim() : category;
    if (!finalCategory) {
      setError("Please enter a category.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      // Bug fix: this used to call fetch() directly, bypassing the shared
      // save function that IncomeModal used — two different code paths
      // doing the same job. Now both modals save the same way.
      await onSave({
        id: transaction?.id,
        email: localStorage.getItem("userEmail"),
        type: "Expense",
        title: finalCategory,
        amount: amt,
        date,
        isReserved,
      });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save expense.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{transaction ? "Edit expense" : "Add expense"}</h3>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {category === "Other" && (
          <input
            placeholder="Enter category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
          />
        )}

        <input
          type="number"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />

        <input type="date" max={today} value={date} onChange={(e) => setDate(e.target.value)} />

        <label className="reserved-checkbox">
          <input
            type="checkbox"
            checked={isReserved}
            onChange={(e) => setIsReserved(e.target.checked)}
          />
          Mark as reserved
        </label>

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          <button onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}