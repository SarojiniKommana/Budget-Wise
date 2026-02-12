import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function BarGraph({ transactions }) {
  // Filter only expenses
  const expenseTransactions = transactions.filter(t => t.type === "Expense");

  // Group by category
  const expenseByCategory = expenseTransactions.reduce((acc, t) => {
    const category = t.title || "Other";
    const found = acc.find(e => e.category === category);
    if (found) {
      found.amount += t.amount;
    } else {
      acc.push({ category, amount: t.amount });
    }
    return acc;
  }, []);

  return (
    <div className="bg-white p-5 rounded-2xl shadow">
      <h2 className="text-lg font-semibold mb-4">Expenses by Category</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={expenseByCategory}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#f87171" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
