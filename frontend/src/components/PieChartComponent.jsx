import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import PropTypes from 'prop-types';
import '../styles/Dashboard.css';

const PieChartComponent = forwardRef(({ transactions = [] }, ref) => {
    const [chartData, setChartData] = useState([]);

    const categoryColors = [
      { label: 'Salary', color: '#007BFF' }, // Dark blue for reliability and stability.
      { label: 'Gift', color: '#4CAF50' }, // Green for generosity and well-being.
      { label: 'Food', color: '#FF6347' }, // Tomato red for appetizing and food-related.
      { label: 'Transport', color: '#FF9800' }, // Orange for movement and travel.
      { label: 'Rent', color: '#FFC107' }, // Gold for significance and importance.
      { label: 'Bills', color: '#673AB7' }, // Deep purple for essential and important expenses.
      { label: 'Health', color: '#2196F3' }, // Blue for calm and health.
      { label: 'Fun', color: '#E91E63' }, // Vibrant pink for playfulness and entertainment.
      { label: 'Charity', color: '#8BC34A' }, // Light green for altruism and giving.
      { label: 'Other', color: '#9E9E9E' } // Gray for neutrality and miscellaneous.
    ];
    

    const fetchData = () => {
      const groupedData = transactions.reduce((acc, transaction) => {
        if (transaction.transaction_type === 'Expense') {
            if (!acc[transaction.category]) {
                acc[transaction.category] = "";
            }
            acc[transaction.category] -= parseFloat(transaction.amount);
            }
        return acc;
      }, {});

      const formattedData = Object.keys(groupedData).map((category) => {
        const colorInfo = categoryColors.find(c => c.label === category);
        const color = colorInfo ? colorInfo.color : '#999'; // Default color if not found
        return {
        name: category,
        value: groupedData[category],
        color: color
        };  
      });

      setChartData(formattedData);
    };

    useImperativeHandle(ref, () => ({
        fetchData
    }));

    useEffect(() => {
        fetchData();
    }, [transactions]);

    const getTooltipContent = ({ payload, active }) => {
      if (active && payload && payload.length) {
        return (
          <div className="custom-tooltip">
            <p className="label">
              {`${payload[0].name} : ${payload[0].value}:-`}
            </p>
          </div>
        );
      }
      return null;
    };

    const Legend = ({ data }) => {
      const sortedData = data.sort((a, b) => b.value - a.value);
      return (
        <div className="legend">
          {sortedData.map((entry, index) => (
            <div key={index} className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: entry.color }}
              ></span>
              <span className="legend-text">{`${entry.name}: ${entry.value}:-`}</span>
            </div>
          ))}
        </div>
      );
    };

    return (
      <div id="pie-chart">
        <div className="pie-chart-with-legend-container">
          <ResponsiveContainer width="80%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={115}
                innerRadius={80}
                fill="#8884d8"
                paddingAngle={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={getTooltipContent} />
            </PieChart>
          </ResponsiveContainer>
          <Legend
            data={chartData.map((entry) => ({
              name: entry.name,
              color: entry.color,
              value: entry.value,
            }))}
          />
        </div>
      </div>
    );
});

PieChartComponent.displayName = 'PieChart';

PieChartComponent.propTypes = {
    transactions: PropTypes.array,
    data: PropTypes.array
};

export default PieChartComponent;