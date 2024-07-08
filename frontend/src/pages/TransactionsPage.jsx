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
        <div className="all-transactions-container">
        <h2>All Transactions</h2>
        {transactions.map((transaction) => (
          <Transaction key={transaction.id} transaction={transaction}>
            <div className="button-delete">
              <button
                onClick={() =>
                  handleDeleteTransaction(transaction.id)
                }
              >
                Del
              </button>
            </div>
          </Transaction>
        ))}
        </div>
      </div>
    );
}

export default TransactionsPage