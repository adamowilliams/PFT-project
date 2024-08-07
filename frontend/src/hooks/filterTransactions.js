import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

export const filterTransactions = (transactions, timePeriod, customStartDate = null, customEndDate = null) => {
    const today = dayjs();

    return transactions.filter(transaction => {
        const transactionDate = dayjs(transaction.created_at);
        if (timePeriod === 'weekly') {
            return transactionDate.isAfter(today.subtract(1, 'week'));
        } else if (timePeriod === 'monthly') {
            return transactionDate.isAfter(today.subtract(1, 'month'));
        } else if (timePeriod === 'yearly') {
            return transactionDate.isAfter(today.subtract(1, 'year'));
        } else if (timePeriod === 'custom' && customStartDate && customEndDate) {
            return transactionDate.isBetween(customStartDate, customEndDate, null, '[]');
        }
        return true; // all
    });
};