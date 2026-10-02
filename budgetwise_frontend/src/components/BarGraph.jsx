import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "../utils/format";

export default function BarGraph({ transactions }) {
  const expenseByCategory = transactions
    .filter((t) => t.type === "Expense")
    .reduce((acc, t) => {
      const category = t.title || "Other";
      const found = acc.find((e) => e.category === category);
      if (found) {
        found.amount += t.amount;
      } else {
        acc.push({ category, amount: t.amount });
      }
      return acc;
    }, []);

  if (expenseByCategory.length === 0) {
    return <p className="chart-empty">No expenses in this period.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={expenseByCategory}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e5ec" vertical={false} />
        <XAxis dataKey="category" tick={{ fontSize: 12, fill: "#5d6577" }} />
        <YAxis tick={{ fontSize: 12, fill: "#5d6577" }} />
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Bar dataKey="amount" fill="#b0442e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}