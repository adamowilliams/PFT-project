import React, { forwardRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Transaction from "./Transaction";


const RecentTransactions = forwardRef(({ transactions = [] }, ref) => {


    const recentTransactions = transactions.slice(0, 7);
    const navigate = useNavigate();

    const handleViewAllTransactionsClick = () => {
      navigate('/transactions');
    };


    return (
        <div id="recent_transactions">
            <div className="recent-transactions-container">
                <h2>Recent Transactions</h2>
                {recentTransactions.map((transaction) => (
                    <Transaction
                        key={transaction.id}
                        transaction={transaction}
                    />
                ))}
                <button onClick={handleViewAllTransactionsClick}>View All Transactions</button>
            </div>
        </div>
    );
});

export default RecentTransactions;