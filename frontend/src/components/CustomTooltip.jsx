import React from 'react';
import dayjs from 'dayjs';
import "../styles/Dashboard.css";
//import categoryInfo from '../data/categoryInfo';

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

export default CustomTooltip;
