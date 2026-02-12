import "../pages/transactions.css";
export default function RecentTransactions({ transactions }) {

  const latest = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <div className="recent-box">
      <div className="recent-header">
        <h3>Recent Transactions</h3>
        <a href="/dashboard/transactions">View All →</a>
      </div>

      <table className="recent-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Reserved</th>
          </tr>
        </thead>

        <tbody>
          {latest.map((t, i) => (
            <tr key={i}>
              <td>{t.date}</td>
              <td>{t.category || t.title}</td>
              <td className={t.type}>{t.type}</td>
              <td className={t.type}>
                {t.type === "income" ? "+ " : "- "}₹{t.amount}
              </td>
              <td>{t.isReserved ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
