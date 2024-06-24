import React, {useEffect, useState} from 'react'
import Transaction from '../components/Transaction';
import { fetchTransactions, deleteTransaction } from '../services/apiService.jsx';

function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchTransactions(setTransactions);
    }, []);


    return (
      <div id="all_transactions">
        <h2>All Transactions</h2>
        {transactions.map((transaction) => (
          <Transaction key={transaction.id} transaction={transaction}>
            <button
              onClick={() =>
                deleteTransaction(transaction.id, () =>
                  fetchTransactions(setTransactions)
                )
              }
            >
              Delete
            </button>
          </Transaction>
        ))}
      </div>
    );
}

export default TransactionsPage