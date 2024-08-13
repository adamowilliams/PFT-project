import React, { forwardRef, useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/Calendar.css';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import '../styles/TooltipStyles.css'; // Import the custom CSS file

const CalendarComponent = forwardRef(({ transactions = [] }, ref) => {
    const [tooltipContent, setTooltipContent] = useState('');
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipKey, setTooltipKey] = useState(0);

    const categoryColors = [
        { label: 'Housing', color: '#FFC107'},
        { label: 'Food & Drink', color: '#FF7043'},
        { label: 'Household', color: '#673AB7'},
        { label: 'Transport', color: '#03A9F4' },
        { label: 'Entertainment & Shopping', color: '#E91E63' },
        { label: 'Miscellaneous', color: '#9E9E9E'}
      ];

    const subCategories = {
        'Housing': ['Building & Garden', 'Rent & Fee'],
        'Food & Drink': ['Groceries', 'Cafe & Snacks', 'Restaurant & Bar', 'Alcohol & Tobacco'],
        'Household': ['Pets', 'Media, Mobile, and IT', 'Healthcare & Wellness'],
        'Transport': ['Vehicles & Fuel', 'Bus & Train'],
        'Entertainment & Shopping': ['Toys & Games', 'Culture & Entertainment', 'Beauty & Personal Care', 'Home Electronics', 'Clothes & Fashion', 'Vacation', 'Sports & Leisure'],
        'Miscellaneous': ['Swish']
    };

    const subCategoriesIcons = {
        'Building & Garden': 'fa-solid fa-tree',
        'Rent & Fee': 'fa-solid fa-file-invoice',
        'Groceries': 'fa-solid fa-shopping-cart',
        'Cafe & Snacks': 'fa-solid fa-coffee',
        'Restaurant & Bar': 'fa-solid fa-pizza-slice',
        'Alcohol & Tobacco': 'fa-solid fa-wine-bottle',
        'Pets': 'fa-solid fa-dog',
        'Media, Mobile, and IT': 'fa-solid fa-mobile-alt',
        'Healthcare & Wellness': 'fa-solid fa-heartbeat',
        'Vehicles & Fuel': 'fa-solid fa-gas-pump',
        'Bus & Train': 'fa-solid fa-train',
        'Toys & Games': 'fa-solid fa-gamepad',
        'Culture & Entertainment': 'fa-solid fa-theater-masks',
        'Beauty & Personal Care': 'fa-solid fa-spa',
        'Home Electronics': 'fa-solid fa-tv',
        'Clothes & Fashion': 'fa-solid fa-tshirt',
        'Vacation': 'fa-solid fa-plane',
        'Sports & Leisure': 'fa-solid fa-futbol',
        'Swish': 'fa-solid fa-mobile-alt'
    };

    const getCategoryColor = (subcategory) => {
        for (let category of categoryColors) {
            if (subCategories[category.label]?.includes(subcategory)) {
                return category.color;
            }
        }
        return '#000000'; // Default color if not found
    };

    // Transform transactions into a format suitable for quick lookup by date
    const markedDates = transactions.reduce((acc, transaction) => {
        const transactionDate = new Date(transaction.created_at);
        const adjustedDate = new Date(transactionDate.getTime() - transactionDate.getTimezoneOffset() * 60000);
        const dateStr = adjustedDate.toISOString().split('T')[0];

        if (!acc[dateStr]) {
            acc[dateStr] = { hasExpense: false, hasIncome: false, transactions: [] };
        }
        if (transaction.transaction_type === 'Expense') {
            acc[dateStr].hasExpense = true;
        } else if (transaction.transaction_type === 'Income') {
            acc[dateStr].hasIncome = true;
        }
        acc[dateStr].transactions.push(transaction);
        return acc;
    }, {});

    const renderTileContent = ({ date, view }) => {
        if (view === 'month') {
            const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            const dateStr = adjustedDate.toISOString().split('T')[0];
            const hasExpense = markedDates[dateStr]?.hasExpense;
            const hasIncome = markedDates[dateStr]?.hasIncome;
            return (
                <>
                    {hasExpense && <div className="expense-dot"></div>}
                    {hasIncome && <div className="income-dot"></div>}
                </>
            );
        }
        return null;
    };

    const handleDayClick = (value) => {
        const adjustedDate = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
        const dateStr = adjustedDate.toISOString().split('T')[0];
        const dayTransactions = markedDates[dateStr]?.transactions || [];
        const content = dayTransactions.map(transaction => {
            const color = getCategoryColor(transaction.subCategory);
            const iconClass = subCategoriesIcons[transaction.subCategory] || 'fa-solid fa-question';
            return `
                <div class="tooltip-item" >
                    <i class="${iconClass}"style="color: ${color}"></i>
                    <span class="description">${transaction.description}</span>
                    <span class="amount">${Math.round(transaction.amount)}</span>
                </div>
            `;
        }).join('');
        setTooltipContent(content);
        setTooltipVisible(true);
        setTooltipKey(prevKey => prevKey + 1);  // Force tooltip to re-render
    };

    useEffect(() => {
        if (tooltipVisible) {
            setTooltipVisible(false);  // Hide tooltip first
            setTimeout(() => setTooltipVisible(true), 0);  // Show tooltip immediately
        }
    }, [tooltipContent]);

    return (
        <div id="calendar-container">
            <Calendar
                width={280}
                height={250}
                locale={'en-GB'}
                tileContent={renderTileContent}
                onClickDay={handleDayClick}
            />
            <Tooltip
                key={tooltipKey}
                html={<div style={{ textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: tooltipContent }} />}
                open={tooltipVisible}
                position="right"  // Position the tooltip to the right
                trigger="manual"
                interactive={true}
                onRequestClose={() => setTooltipVisible(false)}
            >
                <div style={{ display: 'none' }} />
            </Tooltip>
        </div>
    );
});

export default CalendarComponent;
