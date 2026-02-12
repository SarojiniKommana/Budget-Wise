import { useState, useEffect } from "react";

export default function ExpenseModal({ transaction, onClose, onSave }) {
  const today = new Date().toISOString().split("T")[0];

  const [category, setCategory] = useState("Food");
  const [customCategory, setCustomCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [isReserved, setIsReserved] = useState(false);
  const [date, setDate] = useState(today);

  // ✅ prefill for edit
  useEffect(() => {
    if (transaction) {
      setCategory(transaction.title);
      setAmount(transaction.amount);
      setDate(transaction.date);
      setIsReserved(transaction.isReserved);
    }
  }, [transaction]);

  const handleSave = async () => {
  const amt = Number(amount);

  if (!amt || amt <= 0) {
    alert("Amount must be positive");
    return;
  }

  const email = localStorage.getItem("userEmail");

  try {
    const url = transaction
      ? `http://localhost:8080/api/transactions/${transaction.id}` // edit
      : "http://localhost:8080/api/transactions"; // add

    const method = transaction ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        type: "Expense",
        title: category === "Other" ? customCategory : category,
        amount: amt,
        date,
        isReserved
      })
    });

    const msg = await res.text();

    if (!res.ok) {
      alert(msg.message || "Failed to save expense"); // backend validation message
      return;
    }

    const savedTransaction = JSON.parse(msg);

    onSave(savedTransaction); // update table
    onClose();

  } catch (err) {
    alert("Error saving expense");
  }
};


  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{transaction ? "Edit Expense" : "Add Expense"}</h3>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Food</option>
          <option>Travel</option>
          <option>Bills</option>
          <option>Shopping</option>
          <option value="Other">Other</option>
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

        <label>
          <input
            type="checkbox"
            checked={isReserved}
            onChange={(e) => setIsReserved(e.target.checked)}
          />
          Mark as Reserved
        </label>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
