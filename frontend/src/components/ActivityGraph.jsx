import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Label } from 'recharts';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween'; // Import the plugin
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/Dashboard.css';

dayjs.extend(isBetween); // Use the plugin

const categoryColors = [
    { label: 'Housing', color: '#FFC107', icon: 'fa-solid fa-home' },
    { label: 'Food & Drink', color: '#4CAF50', icon: 'fa-solid fa-utensils' },
    { label: 'Household', color: '#673AB7', icon: 'fa-solid fa-couch' },
    { label: 'Transport', color: '#FF9800', icon: 'fa-solid fa-car' },
    { label: 'Entertainment & Shopping', color: '#E91E63', icon: 'fa-solid fa-shopping-bag' },
    { label: 'Miscellaneous', color: '#9E9E9E', icon: 'fa-solid fa-box-open' }
];

const categoryInfo = categoryColors.reduce((acc, { label, color, icon }) => {
    acc[label] = { color, icon };
    return acc;
}, {});

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const expenses = payload.find(p => p.dataKey === 'expense');
        const expenseDetails = expenses && expenses.payload.expenseDetails;

        // Accumulate expenses by category
        const accumulatedExpenses = expenseDetails.reduce((acc, expense) => {
            if (!acc[expense.category]) {
                acc[expense.category] = { count: 0, amount: 0 };
            }
            acc[expense.category].count += 1;
            acc[expense.category].amount += parseFloat(expense.amount);
            return acc;
        }, {});

        return (
            <div className="custom-tooltip">
                {expenseDetails && Object.keys(accumulatedExpenses).length > 0 && (
                    <div className="custom-tooltip-container">
                        <div style={{ display: 'flex', flexWrap: 'wrap', fontSize: "13px" }}>
                            {Object.entries(accumulatedExpenses).map(([category, data], index) => (
                                <div key={index} style={{ margin: '0 5px' }}>
                                    <i className={categoryInfo[category]?.icon || 'fa-solid fa-question'} style={{ marginRight: '5px', color: categoryInfo[category]?.color || '#000' }}>
                                        <sup style={{ fontSize: '9px', position: 'relative', left: '1px', top: '-4px' }}>{data.count}</sup>
                                    </i>
                                    <span> {data.amount.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <p>{dayjs(label).format('dddd, MMMM D, YYYY')}</p> {/* Display the date in a friendly format */}
                    </div>
                )}
            </div>
        );
    }
    return null;
};

const ActivityGraph = forwardRef(({ transactions = [] }, ref) => {
    const [chartData, setChartData] = useState([]);
    const [timePeriod, setTimePeriod] = useState('all');
    const [visibleLines, setVisibleLines] = useState({ expense: true, balance: true });
    const [customStartDate, setCustomStartDate] = useState(null);
    const [customEndDate, setCustomEndDate] = useState(null);

    const fetchData = () => {
        const today = dayjs();
        let filteredTransactions = transactions.filter(transaction => {
            if (timePeriod === 'weekly') {
                return dayjs(transaction.created_at).isAfter(today.subtract(1, 'week'));
            } else if (timePeriod === 'monthly') {
                return dayjs(transaction.created_at).isAfter(today.subtract(1, 'month'));
            } else if (timePeriod === 'yearly') {
                return dayjs(transaction.created_at).isAfter(today.subtract(1, 'year'));
            } else if (timePeriod === 'custom' && customStartDate && customEndDate) {
                return dayjs(transaction.created_at).isBetween(customStartDate, customEndDate, null, '[]');
            }
            return true; // all
        });

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
            <div style={{
                marginLeft: '25px',
                border: '1px solid #ddd', // Light border
                borderRadius: '8px', // Rounded corners
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Shadow effect
                padding: '16px', // Space inside the border
            }}>
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
                        <XAxis dataKey="date" tickFormatter={getXAxisTickFormatter()} tick={{ fontSize: 13 }}>
                        </XAxis>
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
