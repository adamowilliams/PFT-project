import api from '../api'; // Adjust the import path based on your project structure
import dayjs from 'dayjs'; // Adjust the import path for dayjs

export const fetchTransactions = (setTransactions) => {
    api.get('/api/transactions/')
        .then(response => {
            setTransactions(response.data);
            console.log(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the transactions!', error);
        });
};

export const fetchImportedTransactions = (setTransactions) => {
    api.get('/api/transactions/import/')
        .then(response => {
            setTransactions(response.data);
            console.log(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the imported transactions!', error);
        });
    };

export const deleteTransaction = (id, updateTransactions) => {
    api.delete(`/api/transactions/delete/${id}/`)
        .then(response => {
            if (response.status === 204);
            else alert("Failed to delete transaction.");
            updateTransactions();
        })
        .catch((error) => alert(error));
};

export const fetchChartData = async () => {
    try {
        const response = await api.get('/api/transactions/');
        const transactions = response.data;
        
        console.log('Fetched transactions:', transactions);  // Debug statement
        
        // Group transactions by date
        const groupedData = transactions.reduce((acc, transaction) => {
            const date = dayjs(transaction.date).format('YYYY-MM-DD');
            if (!acc[date]) {
                acc[date] = 0;
            }
            if (transaction.transaction_type === 'Expense') {
                acc[date] += parseFloat(transaction.amount);
            }
            return acc;
        }, {});

        console.log('Grouped data:', groupedData);  // Debug statement

        const labels = Object.keys(groupedData);
        const data = Object.values(groupedData);

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Daily Spending',
                    data: data,
                },
            ],
        };
    } catch (error) {
        console.error('There was an error fetching the chart data!', error);
        throw error;
    }
};