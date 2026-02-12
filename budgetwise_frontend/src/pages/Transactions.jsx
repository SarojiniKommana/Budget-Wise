import React, { useState } from "react";
import { useEffect } from "react";
import "./transactions.css";
import TransactionTable from "../components/TransactionTable";
import IncomeModal from "../components/IncomeModal";
import ExpenseModal from "../components/ExpenseModal";
import SummaryCards from "../components/SummaryCards";

export default function Transactions() {
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  // Edit transaction
  const [editTransaction, setEditTransaction] = useState(null);


  useEffect(() => {
  const email = localStorage.getItem("userEmail");
 console.log("Email from localStorage:", email);
  fetch(`http://localhost:8080/api/transactions?email=${email}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }
      return res.json();
    })
    .then(data => setTransactions(data))
    .catch(err => {
      console.error("Failed to fetch transactions:", err);
      setTransactions([]); // fallback
    });
}, []);
   const saveTransaction = async (data) => {
  const isEdit = !!data.id;

  const url = isEdit
    ? `http://localhost:8080/api/transactions/${data.id}`
    : `http://localhost:8080/api/transactions`;

  const method = isEdit ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const saved = await res.json();

  if (isEdit) {
    setTransactions(transactions.map(t =>
      t.id === saved.id ? saved : t
    ));
  } else {
    setTransactions([...transactions, saved]);
  }

  setShowExpenseModal(false);
  setShowIncomeModal(false);
  setEditTransaction(null);
};


    const handleEdit = (transaction) => {
  setEditTransaction(transaction); // store which one to edit

  if (transaction.type === "Expense") {
    setShowExpenseModal(true);
  } else {
    setShowIncomeModal(true);
  }
};


  // Delete transaction
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    const res = await fetch(`http://localhost:8080/api/transactions/${id}`, { method: "DELETE" });

    if (res.ok) {
      setTransactions(transactions.filter(t => t.id !== id));
    } else {
      alert("Failed to delete transaction");
    }
  };


  return (
    <div className="transactions-page">
   <h2 className="page-title">Transactions</h2>
      <div className="actions">
        <button onClick={() => setShowIncomeModal(true)}>+ Add Income</button>
        <button onClick={() => setShowExpenseModal(true)}>+ Add Expense</button>
      </div>
    
    
      <TransactionTable transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />


                {showIncomeModal && (
            <IncomeModal
        transaction={editTransaction}
        onClose={() => {
          setShowIncomeModal(false);
          setEditTransaction(null);
        }}
        onSave={saveTransaction}
      />

        )}

      {showExpenseModal && (
        <ExpenseModal
  transaction={editTransaction}
  onClose={() => setShowExpenseModal(false)}
  onSave={(saved) => {
    if (editTransaction) {
      setTransactions(t =>
        t.map(x => x.id === saved.id ? saved : x)
      );
    } else {
      setTransactions(t => [...t, saved]);
    }
  }}
/>

      )}

    </div>
  );
}
