import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';

const BalanceDisplay = forwardRef(({ children, transactions = [] }, ref) => {
    const [balance, setBalance] = useState(0);

    
    const fetchData = () => {
        const income = transactions.filter(t => t.transaction_type === 'Income').reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const expense = transactions.filter(t => t.transaction_type === 'Expense').reduce((sum, t) => sum - parseFloat(t.amount), 0);
        const calculatedBalance = income - expense;
        setBalance(Math.max(0, calculatedBalance));
    };

    useImperativeHandle(ref, () => ({
        fetchData
    }));

    useEffect(() => {
        fetchData();
    }, [transactions]);

    return (
        <div id="balance-display">
            <h2>Balance</h2>
            <p>${balance.toFixed(2)}</p>
            {children}
        </div>
    );
});

BalanceDisplay.displayName = 'BalanceDisplay';

BalanceDisplay.propTypes = {
    transactions: PropTypes.array,
    children: PropTypes.node
};

export default BalanceDisplay;
