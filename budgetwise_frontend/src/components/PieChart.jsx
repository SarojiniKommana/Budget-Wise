import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function PieChartComponent({ transactions }) {
  const COLORS = ["#4ade80", "#f87171"]; // green = income, red = expense

  const totalIncome = transactions
    .filter(t => t.type === "Income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === "Expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const pieData = [
    { name: "Income", value: totalIncome },
    { name: "Expense", value: totalExpense }
  ];

  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4">Income vs Expense</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            dataKey="value"
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
