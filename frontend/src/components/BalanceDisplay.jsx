import React, { useEffect, useState } from 'react';
import api from '../api';
import '../styles/Dashboard.css';

const BalanceDisplay = () => {
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        api.get('/api/transactions/')
            .then(response => {
                const transactions = response.data;
                const income = transactions.filter(t => t.transaction_type === 'Income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
                const expense = transactions.filter(t => t.transaction_type === 'Expense').reduce((sum, t) => sum + parseFloat(t.amount), 0);
                setBalance(income - expense);
            })
            .catch(error => {
                console.error('There was an error fetching the balance!', error);
            });
    }, []);

    return (
        <div id="balance-display">
            <h2>Balance</h2>
            <p>${balance.toFixed(2)}</p>
        </div>
    );
};

export default BalanceDisplay;