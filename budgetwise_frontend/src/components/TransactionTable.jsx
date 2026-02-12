import { FaEdit, FaTrash } from "react-icons/fa";

export default function TransactionTable({ transactions, onEdit, onDelete }) {
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Title/Category</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{t.date}</td>

              <td className={t.type}>
                {t.type === "Income" ? "Income" : "Expense"}
              </td>

              <td>{t.title || t.category}</td>

              <td className={t.type}>
                {t.type === "Income" ? "+" : "-"}₹{t.amount}
              </td>

              <td className="actions-cell">
                <FaEdit onClick={() => onEdit(t)}  />
                <FaTrash onClick={() => onDelete(t.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
