import React from "react";
import { useState, useEffect, useMemo } from "react";
import "./transactions.css";
import TransactionTable from "../components/TransactionTable";
import IncomeModal from "../components/IncomeModal";
import ExpenseModal from "../components/ExpenseModal";

const PAGE_SIZE = 10;

export default function Transactions() {
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [editTransaction, setEditTransaction] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");

    fetch(`http://localhost:8080/api/transactions?email=${email}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
        return res.json();
      })
      .then((data) => setTransactions(data))
      .catch((err) => {
        console.error("Failed to fetch transactions:", err);
        setTransactions([]);
      });
  }, []);

  // Bug fix: this is now the one place a transaction gets saved. Previously
  // IncomeModal called this function while ExpenseModal ran its own,
  // separate fetch — two code paths for the same job.
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

    if (!res.ok) {
      let message = "Failed to save transaction";
      try {
        const err = await res.json();
        message = err.message || message;
      } catch {
        // response body wasn't JSON — keep the default message
      }
      throw new Error(message);
    }

    const saved = await res.json();
    setTransactions((prev) =>
      isEdit ? prev.map((t) => (t.id === saved.id ? saved : t)) : [...prev, saved]
    );
    return saved;
  };

  const handleEdit = (transaction) => {
    setEditTransaction(transaction);
    if (transaction.type === "Expense") {
      setShowExpenseModal(true);
    } else {
      setShowIncomeModal(true);
    }
  };

  // Bug fix / UX fix: window.confirm() has been replaced everywhere else in
  // this app — this was the one place still using a native browser popup.
  // First click arms a "Confirm?" state on that row; a second click deletes.
  const handleDelete = async (id) => {
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }
    setConfirmDeleteId(null);
    const res = await fetch(`http://localhost:8080/api/transactions/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } else {
      console.error("Failed to delete transaction");
    }
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return transactions
      .filter((t) => typeFilter === "All" || t.type === typeFilter)
      .filter((t) => !term || (t.title || "").toLowerCase().includes(term))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, typeFilter, search]);

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <h2 className="page-title">Transactions</h2>
        <div className="actions">
          <button className="btn-outline" onClick={() => setShowIncomeModal(true)}>
            + Add income
          </button>
          <button onClick={() => setShowExpenseModal(true)}>+ Add expense</button>
        </div>
      </div>

      <div className="transactions-toolbar">
        <input
          className="search-input"
          placeholder="Search by category or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="All">All types</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="chart-empty">No transactions match your search.</p>
      ) : (
        <TransactionTable
          transactions={pageItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
          confirmDeleteId={confirmDeleteId}
        />
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}

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
          onClose={() => {
            setShowExpenseModal(false);
            setEditTransaction(null);
          }}
          onSave={saveTransaction}
        />
      )}
    </div>
  );
}