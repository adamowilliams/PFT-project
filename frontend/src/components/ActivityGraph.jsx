import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import '../styles/Dashboard.css';

const ActivityGraph = forwardRef(({ transactions = [] }, ref) => {
    const [chartData, setChartData] = useState([]);

    const fetchData = () => {
        const groupedData = transactions.reduce((acc, transaction) => {
            const date = dayjs(transaction.created_at).format('YYYY-MM-DD');
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
            balance = Math.max(0, balance);
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
            <ResponsiveContainer height={270}>
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


export default ActivityGraph;
