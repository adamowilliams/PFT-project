
import React from 'react';
import PropTypes from 'prop-types';

function Transaction({ transaction, onDelete }) {
  return (
    <div className="transaction">
      <h3>{transaction.category}</h3>
      <p>{transaction.description}</p>
      <p>{transaction.amount}:-</p>
      <p>{transaction.created_at}</p>
      <button onClick={() => onDelete(transaction.id)}>Delete</button>
    </div>
  );
}

Transaction.propTypes = {
  transaction: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default Transaction;