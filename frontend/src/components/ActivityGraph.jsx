import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';

const ActivityGraph = forwardRef(({ transactions = [] }, ref) => {
    const [chartData, setChartData] = useState([]);

    const fetchData = () => {
        const groupedData = transactions.reduce((acc, transaction) => {
            const date = dayjs(transaction.date).format('YYYY-MM-DD');
            if (!acc[date]) {
                acc[date] = { expense: 0, balance: 0 };
            }
            if (transaction.transaction_type === 'Expense') {
                acc[date].balance += parseFloat(transaction.amount);
                acc[date].expense -= parseFloat(transaction.amount);
            } else if (transaction.transaction_type === 'Income') {
                acc[date].balance += parseFloat(transaction.amount);
            }
            return acc;
        }, {});

        // Calculate cumulative balance
        const dates = Object.keys(groupedData).sort();
        let balance = 0;
        dates.forEach(date => {
            balance += groupedData[date].balance;
            groupedData[date].balance = balance;
        });

        const formattedData = dates.map(date => ({
            date: date,
            expense: groupedData[date].expense,
            balance: groupedData[date].balance,
        }));

        setChartData(formattedData);
    };

    useImperativeHandle(ref, () => ({
        fetchData
    }));

    useEffect(() => {
        fetchData();
    }, [transactions]);

    return (
        <div id="activity-graph">
            <h2>Daily Spending and Balance</h2>
            <ResponsiveContainer width="70%" height={200}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="expense" stroke="#FF0000" strokeWidth={2} />
                    <Line type="monotone" dataKey="balance" stroke="#0000FF" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
});

ActivityGraph.displayName = 'ActivityGraph';
ActivityGraph.propTypes = {
    transactions: PropTypes.array
};

export default ActivityGraph;
