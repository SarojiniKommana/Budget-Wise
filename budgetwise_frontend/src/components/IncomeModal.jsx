import React from "react";
import { useState } from "react";

export default function IncomeModal({ transaction, onClose, onSave }) {
  const today = new Date().toISOString().split("T")[0];

  const [title, setTitle] = useState(transaction?.title || "");
  const [amount, setAmount] = useState(transaction?.amount ?? "");
  const [date, setDate] = useState(transaction?.date || today);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await onSave({
        id: transaction?.id,
        email: localStorage.getItem("userEmail"),
        type: "Income",
        title: title.trim(),
        amount: amt,
        date,
      });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save income.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{transaction ? "Edit income" : "Add income"}</h3>

        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />

        <input
          type="number"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />

        <input type="date" max={today} value={date} onChange={(e) => setDate(e.target.value)} />

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