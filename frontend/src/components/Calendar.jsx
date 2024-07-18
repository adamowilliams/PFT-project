import React, { forwardRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/Calendar.css';

const CalendarComponent = forwardRef(({ transactions = [] }, ref) => {
    // Transform transactions into a format suitable for quick lookup by date
    const markedDates = transactions.reduce((acc, transaction) => {
        const transactionDate = new Date(transaction.created_at);
        const adjustedDate = new Date(transactionDate.getTime() - transactionDate.getTimezoneOffset() * 60000);
        const dateStr = adjustedDate.toISOString().split('T')[0];

        if (!acc[dateStr]) {
            acc[dateStr] = { hasExpense: false, hasIncome: false };
        }
        if (transaction.transaction_type === 'Expense') {
            acc[dateStr].hasExpense = true;
        } else if (transaction.transaction_type === 'Income') {
            acc[dateStr].hasIncome = true;
        }
        return acc;
    }, {});

    const customLocale = {
        // Other localization options can be added here if needed
        localize: {
            day: (n) => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][n],
        },
        formatLong: {
            date: () => 'yyyy-MM-dd',
        },
    };

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

    return (
        <div id="calendar-container">
            <Calendar width={280} height={250} locale={'en-GB'} 
                tileContent={renderTileContent}
            />
        </div>
    );
});

export default CalendarComponent;