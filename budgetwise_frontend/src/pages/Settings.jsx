import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { User, Download } from "lucide-react";
import { CURRENCY_OPTIONS, getCurrency, setCurrency, formatCurrency } from "../utils/format";
import "./transactions.css";

export default function Settings() {
  const navigate = useNavigate();

  const name = localStorage.getItem("userName");
  const email = localStorage.getItem("userEmail");

  const [currency, setCurrencyState] = useState(getCurrency());
  const [budget, setBudget] = useState(localStorage.getItem("monthlyBudget") || "");
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  const handleCurrencyChange = (e) => {
    const code = e.target.value;
    setCurrency(code);
    setCurrencyState(code);
  };

  const handleBudgetSave = () => {
    localStorage.setItem("monthlyBudget", budget);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = async () => {
    setExporting(true);
    setExportError("");
    try {
      const res = await fetch(`http://localhost:8080/api/transactions?email=${email}`);
      if (!res.ok) throw new Error("Request failed");
      const transactions = await res.json();

      const header = "Date,Title,Type,Amount,Reserved\n";
      const rows = transactions
        .map((t) =>
          [t.date, `"${(t.title || "").replace(/"/g, '""')}"`, t.type, t.amount, t.isReserved]
            .join(",")
        )
        .join("\n");

      const blob = new Blob([header + rows], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `budgetwise-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
      setExportError("Couldn't export transactions. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="settings-page">
      <h1 className="settings-title">Settings</h1>

      {/* Profile */}
      <section className="settings-section">
        <div className="profile-row">
          <div className="profile-icon">
            <User size={36} />
          </div>
          <div className="profile-info">
            <h2>{name}</h2>
            <p>{email}</p>
          </div>
        </div>
        <button className="change-btn" onClick={() => navigate("/change-password")}>
          Change password
        </button>
      </section>

      <hr />

      {/* Currency */}
      <section className="settings-section">
        <h3 className="settings-section-title">Currency</h3>
        <p className="settings-section-hint">Applies to every amount shown across the app.</p>
        <select className="settings-select" value={currency} onChange={handleCurrencyChange}>
          {CURRENCY_OPTIONS.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </section>

      <hr />

      {/* Monthly budget */}
      <section className="settings-section">
        <h3 className="settings-section-title">Monthly budget</h3>
        <p className="settings-section-hint">
          A soft overall target — per-category budgets with alerts are coming once that's built
          into the backend. This one is saved on this device for now.
        </p>
        <div className="settings-inline-row">
          <input
            type="number"
            min="0"
            className="settings-input"
            placeholder="e.g. 30000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
          <button className="change-btn" onClick={handleBudgetSave}>
            Save
          </button>
        </div>
        {saved && <p className="settings-save-confirm">Saved.</p>}
        {budget && <p className="settings-section-hint">Currently set to {formatCurrency(budget)}.</p>}
      </section>

      <hr />

      {/* Export */}
      <section className="settings-section">
        <h3 className="settings-section-title">Export data</h3>
        <p className="settings-section-hint">Download every transaction as a CSV file.</p>
        <button className="change-btn export-btn" onClick={handleExport} disabled={exporting}>
          <Download size={16} /> {exporting ? "Exporting..." : "Export as CSV"}
        </button>
        {exportError && <p className="settings-error">{exportError}</p>}
      </section>

      <hr />

      {/* Danger zone */}
      <section className="settings-section">
        <h3 className="settings-section-title">Delete account</h3>
        <p className="settings-section-hint">
          Permanently deletes your account and all transactions. Not available yet — the backend
          doesn't have a delete-account endpoint.
        </p>
        <button className="danger-btn" disabled title="Requires a backend endpoint first">
          Delete account
        </button>
      </section>
    </div>
  );
}