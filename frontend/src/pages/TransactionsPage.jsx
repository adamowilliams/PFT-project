import React, {useEffect, useState} from 'react'
import Transaction from '../components/Transaction';
import { fetchTransactions, deleteTransaction } from '../services/apiService.jsx';
import '../styles/Transactions.css';

function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchTransactions(setTransactions);
    }, []);


    return (
      <div id="all-transactions">
        <h2>All Transactions</h2>
        {transactions.map((transaction) => (
          <Transaction key={transaction.id} transaction={transaction}>
            <div className="button-delete">
              <button
                onClick={() =>
                  deleteTransaction(transaction.id, () =>
                    fetchTransactions(setTransactions)
                  )
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