import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Label } from 'recharts';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/Dashboard.css';
import CustomTooltip from './CustomTooltip.jsx';
import { filterTransactions } from '../hooks/filterTransactions';

dayjs.extend(isBetween);

const ActivityGraph = forwardRef(({ transactions = [] }, ref) => {
    const [chartData, setChartData] = useState([]);
    const [timePeriod, setTimePeriod] = useState('all');
    const [visibleLines, setVisibleLines] = useState({ expense: true, balance: true });
    const [customStartDate, setCustomStartDate] = useState(null);
    const [customEndDate, setCustomEndDate] = useState(null);

    const fetchData = () => {
        const filteredTransactions = filterTransactions(transactions, timePeriod, customStartDate, customEndDate);

        const groupedData = filteredTransactions.reduce((acc, transaction) => {
            const date = dayjs(transaction.created_at).format('YYYY-MM-DD');
            if (!acc[date]) {
                acc[date] = { expense: 0, balance: 0, expenseDetails: [] };
            }
            if (transaction.transaction_type === 'Expense') {
                acc[date].balance += parseFloat(transaction.amount);
                acc[date].expense -= parseFloat(transaction.amount);
                acc[date].expenseDetails.push({
                    category: transaction.category,
                    amount: transaction.amount,
                });
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
            expenseDetails: groupedData[date].expenseDetails,
        }));

        setChartData(formattedData);
    };

    useImperativeHandle(ref, () => ({
        fetchData
    }));

    useEffect(() => {
        fetchData();
    }, [transactions, timePeriod, customStartDate, customEndDate]);

    const handleLegendClick = (value) => {
        setVisibleLines(prevState => ({
            ...prevState,
            [value]: !prevState[value]
        }));
    };

    const handleTimePeriodChange = (period) => {
        setTimePeriod(period);
    };

    const getXAxisTickFormatter = () => {
        let lastMonth = null;
        if (timePeriod === 'weekly') {
            return (tick) => dayjs(tick, 'YYYY-MM-DD').format('D MMM');
        } else if (timePeriod === 'monthly') {
            return (tick) => dayjs(tick, 'YYYY-MM-DD').format('D MMM');
        } else if (timePeriod === 'all') {
            return (tick) => {
                const currentTickDate = dayjs(tick, 'YYYY-MM-DD');
                const currentMonth = currentTickDate.month();
                if (currentMonth !== lastMonth) {
                    lastMonth = currentMonth;
                    return currentTickDate.format('MMM');
                }
                return '';
            }
        } else {
            return (tick) => dayjs(tick, 'YYYY-MM-DD').format('D MMM');
        }
    };


    return (
        <div id="activity-graph">
            <div className="shadow-border">
                <div className="time-period-buttons">
                    <button
                        className={timePeriod === 'weekly' ? 'active' : ''}
                        onClick={() => handleTimePeriodChange('weekly')}
                    >
                        1W
                    </button>
                    <button
                        className={timePeriod === 'monthly' ? 'active' : ''}
                        onClick={() => handleTimePeriodChange('monthly')}
                    >
                        1M
                    </button>
                    <button
                        className={timePeriod === 'yearly' ? 'active' : ''}
                        onClick={() => handleTimePeriodChange('yearly')}
                    >
                        1Y
                    </button>
                    <button
                        className={timePeriod === 'all' ? 'active' : ''}
                        onClick={() => handleTimePeriodChange('all')}
                    >
                        All
                    </button>
                    <button
                        className={timePeriod === 'custom' ? 'active' : ''}
                        onClick={() => handleTimePeriodChange('custom')}
                    >
                        Custom
                    </button>
                </div>
                {timePeriod === 'custom' && (
                    <div className="custom-date-range">
                        <DatePicker
                            selected={customStartDate}
                            onChange={(date) => setCustomStartDate(date)}
                            selectsStart
                            startDate={customStartDate}
                            endDate={customEndDate}
                            placeholderText="Start Date"
                        />
                        <DatePicker
                            selected={customEndDate}
                            onChange={(date) => setCustomEndDate(date)}
                            selectsEnd
                            startDate={customStartDate}
                            endDate={customEndDate}
                            placeholderText="End Date"
                        />
                    </div>
                )}
                <ResponsiveContainer width="100%" height={230}>
                    <AreaChart data={chartData}>
                        <XAxis
                            dataKey="date"
                            tickFormatter={getXAxisTickFormatter()}
                            tick={{
                                fontSize: 13
                            }}
                        />
                        <YAxis tick={{ fontSize: 13 }}>
                            <Label value="SEK" angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: 10 }} />
                        </YAxis>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            layout="horizontal"
                            verticalAlign="top"
                            align="right"
                            onClick={(e) => handleLegendClick(e.dataKey)}
                            formatter={(value) => {
                                const color = value === 'expense' ? '#FF0000' : '#0000FF';
                                return <span style={{ color, fontSize: "10px" }}>{value.charAt(0).toUpperCase() + value.slice(1)}</span>;
                            }}
                        />
                        {visibleLines.expense && <Area type="monotone" dataKey="expense" stroke="#FF0000" fillOpacity={0.4} fill="#FF0000" />}
                        {visibleLines.balance && <Area type="monotone" dataKey="balance" stroke="#0000FF" fillOpacity={0.1} fill="#0000FF" />}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
});

export default ActivityGraph;
