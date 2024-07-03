import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import '../styles/Dashboard.css';

const PieChartComponent = forwardRef(({ transactions = [] }, ref) => {
    const [chartData, setChartData] = useState([]);

    const categoryColors = [
      { label: 'Salary', color: '#007BFF', icon: 'fa-solid fa-wallet' },
      { label: 'Gift', color: '#4CAF50', icon: 'fa-solid fa-gift' },
      { label: 'Food', color: '#FF6347', icon: 'fa-solid fa-utensils' },
      { label: 'Transport', color: '#FF9800', icon: 'fa-solid fa-bus' },
      { label: 'Rent', color: '#FFC107', icon: 'fa-solid fa-home' },
      { label: 'Bills', color: '#673AB7', icon: 'fa-solid fa-file-invoice-dollar' },
      { label: 'Health', color: '#2196F3', icon: 'fa-solid fa-heartbeat' },
      { label: 'Fun', color: '#E91E63', icon: 'fa-solid fa-face-grin-beam' },
      { label: 'Charity', color: '#8BC34A', icon: 'fa-solid fa-hands-helping' },
      { label: 'Other', color: '#9E9E9E', icon: 'fa-solid fa-ellipsis-h' }
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
        const color = colorInfo ? colorInfo.color : '#999';
        const icon = colorInfo ? colorInfo.icon : 'fa-solid fa-question';
        return {
        name: category,
        value: groupedData[category],
        color: color,
        icon: icon
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
  

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = (innerRadius + outerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const iconClass = chartData[index].icon;

    return (
        <g>
            <foreignObject x={x - 10} y={y - 10} width={20} height={20} style={{overflow:"visible"}}>
                <i className={iconClass} style={{ color: "white" }}></i>
            </foreignObject>
        </g>
    );
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
      <div id="pie-chart-with-legend">
        <div className="pie-chart">
          <ResponsiveContainer>
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
                labelLine={false}
                label={renderCustomizedLabel}
                paddingAngle={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color}  />
                ))}
              </Pie>
              <Tooltip content={getTooltipContent} />
            </PieChart>
          </ResponsiveContainer>
          </div>
          <Legend
            data={chartData.map((entry) => ({
              name: entry.name,
              color: entry.color,
              value: entry.value,
            }))}
          />
      </div>
    );
});

export default PieChartComponent;