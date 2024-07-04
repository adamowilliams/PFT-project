import React from 'react';

function Transaction({ transaction, children }) {
  return (
    <div className="transaction">
      <h3>{transaction.category}</h3>
      <h3>{transaction.subCategory}</h3>
      <p>{transaction.description}</p>
      <p>{transaction.amount}:-</p>
      <p>{transaction.created_at}</p>
      {children}
    </div>
  );
}

export default Transaction;