import { useState, useEffect } from "react";

export default function IncomeModal({ transaction, onClose, onSave }) {
  const today = new Date().toISOString().split("T")[0];

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today);

  // ✅ THIS is what you were missing
  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title);
      setAmount(transaction.amount);
      setDate(transaction.date);
    }
  }, [transaction]);

  const handleSave = () => {
    const email = localStorage.getItem("userEmail");

    onSave({
      id: transaction?.id, // important for edit
      email,
      type: "Income",
      title,
      amount: Number(amount),
      date,
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{transaction ? "Edit Income" : "Add Income"}</h3>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />

        <input
          type="date"
          max={today}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
