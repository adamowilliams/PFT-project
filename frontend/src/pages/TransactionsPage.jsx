import React, {useEffect, useState} from 'react'
import Transaction from '../components/Transaction';

import '../styles/Transactions.css';
import useTransactions from '../hooks/useTransactions';

function TransactionsPage() {
  const {
    transactions,
    handleGetTransactions,
    handleDeleteTransaction,
  } = useTransactions();

    useEffect(() => {
        handleGetTransactions();
    }, []);


    return (
      <div id="all-transactions">
        <h2>All Transactions</h2>
        {[...transactions].reverse().map((transaction) => (
          <Transaction key={transaction.id} transaction={transaction}>
            <div className="button-delete">
              <button
                onClick={() =>
                  handleDeleteTransaction(transaction.id)
                }
              >
                Delete
              </button>
            </div>
          </Transaction>
        ))}
      </div>
    );
}

export default TransactionsPage