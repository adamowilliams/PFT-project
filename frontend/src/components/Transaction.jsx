
import React from 'react';
import PropTypes from 'prop-types';

function Transaction({ transaction, children }) {
  return (
    <div className="transaction">
      <h3>{transaction.category}</h3>
      <p>{transaction.description}</p>
      <p>{transaction.amount}:-</p>
      <p>{transaction.created_at}</p>
      {children}
    </div>
  );
}

Transaction.propTypes = {
  transaction: PropTypes.object.isRequired,
  children: PropTypes.node
};

export default Transaction;