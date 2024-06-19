import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import api from '../api';

// Register the components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function ActivityGraph() {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Transaction Amounts',
                data: [],
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
            },
        ],
    });

    useEffect(() => {
        fetchChartData();
    }, []);

    const fetchChartData = () => {
        api.get('/api/transactions/')
            .then(response => {
                const transactions = response.data;
                const labels = transactions.map(transaction => transaction.date);
                const data = transactions.map(transaction => transaction.amount);
                
                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Transaction Amounts',
                            data: data,
                            borderColor: 'rgba(75,192,192,1)',
                            backgroundColor: 'rgba(75,192,192,0.2)',
                        },
                    ],
                });
            })
            .catch(error => {
                console.error('There was an error fetching the chart data!', error);
            });
    };

    return (
        <div id="activity-graph">
            <h2>Activity Graph</h2>
            <Line data={chartData} />
        </div>
    );
}

export default ActivityGraph;
