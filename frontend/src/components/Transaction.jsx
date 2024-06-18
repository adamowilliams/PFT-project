
function Transaction({ transaction, onDelete }) {
  return (
    <div className="transaction">
      <h3>{transaction.transaction_type} - {transaction.category}</h3>
      <p>{transaction.description}</p>
      <p>Amount: ${transaction.amount}</p>
      <button onClick={() => onDelete(transaction.id)}>Delete</button>
    </div>
  );
}

export default Transaction;