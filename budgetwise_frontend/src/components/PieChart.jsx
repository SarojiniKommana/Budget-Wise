import  React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency } from "../utils/format";

const COLORS = { Income: "#1b7a5b", Expense: "#b0442e" };

export default function PieChartComponent({ transactions }) {
  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const pieData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense },
  ].filter((d) => d.value > 0);

  if (pieData.length === 0) {
    return <p className="chart-empty">No transactions in this period.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={pieData} cx="50%" cy="50%" outerRadius={95} dataKey="value" label>
          {pieData.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(value)} />
      </PieChart>
    </ResponsiveContainer>
  );
}