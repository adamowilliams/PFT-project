import React, { useState, useEffect, useImperativeHandle, forwardRef, useCallback, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import '../styles/Dashboard.css';

const PieChartComponent = forwardRef(({ transactions = [] }, ref) => {
    const [chartData, setChartData] = useState([]);
    const [subCategoryData, setSubCategoryData] = useState([]);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [timePeriod, setTimePeriod] = useState('all');

    const categoryColors = [
        { label: 'Housing', color: '#FFC107', icon: 'fa-solid fa-home' },
        { label: 'Food & Drink', color: '#4CAF50', icon: 'fa-solid fa-utensils' },
        { label: 'Household', color: '#673AB7', icon: 'fa-solid fa-couch' },
        { label: 'Transport', color: '#FF9800', icon: 'fa-solid fa-car' },
        { label: 'Entertainment & Shopping', color: '#E91E63', icon: 'fa-solid fa-shopping-bag' },
        { label: 'Miscellaneous', color: '#9E9E9E', icon: 'fa-solid fa-ellipsis-h' }
    ];

    const subcategories = {
        'Housing': ['Building & Garden', 'Rent & Fee'],
        'Food & Drink': ['Groceries', 'Cafe & Snacks', 'Restaurant & Bar', 'Alcohol & Tobacco'],
        'Household': ['Pets', 'Media, Mobile, and IT', 'Healthcare & Wellness'],
        'Transport': ['Vehicles & Fuel', 'Bus & Train'],
        'Entertainment & Shopping': ['Toys & Games', 'Culture & Entertainment', 'Beauty & Personal Care', 'Home Electronics', 'Clothes & Fashion', 'Vacation', 'Sports & Leisure'],
        'Miscellaneous': ['Swish']
    };

    const subcategoriesIcons = {
        'Building & Garden': 'fa-solid fa-tree',
        'Rent & Fee': 'fa-solid fa-file-invoice',
        'Groceries': 'fa-solid fa-apple-alt',
        'Cafe & Snacks': 'fa-solid fa-coffee',
        'Restaurant & Bar': 'fa-solid fa-utensils',
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

    const fetchData = useCallback(() => {
        const today = dayjs();
        let filteredTransactions = transactions;

        if (timePeriod === 'weekly') {
            filteredTransactions = transactions.filter(transaction =>
                dayjs(transaction.created_at).isAfter(today.subtract(1, 'week'))
            );
        } else if (timePeriod === 'monthly') {
            filteredTransactions = transactions.filter(transaction =>
                dayjs(transaction.created_at).isAfter(today.subtract(1, 'month'))
            );
        } else if (timePeriod === 'yearly') {
            filteredTransactions = transactions.filter(transaction =>
                dayjs(transaction.created_at).isAfter(today.subtract(1, 'year'))
            );
        }

        const groupedData = filteredTransactions.reduce((acc, transaction) => {
            if (transaction.transaction_type === 'Expense') {
                if (!acc[transaction.category]) {
                    acc[transaction.category] = 0;
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
    }, [transactions, timePeriod]);

    useImperativeHandle(ref, () => ({
        fetchData
    }));

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleTimePeriodChange = (period) => {
        setTimePeriod(period);
    };

    const handleMouseEnter = (category) => {
        setHoveredCategory(category);
        const subcategoryData = transactions.reduce((acc, transaction) => {
            if (transaction.transaction_type === 'Expense' && transaction.category === category) {
                if (!acc[transaction.subCategory]) {
                    acc[transaction.subCategory] = 0;
                }
                acc[transaction.subCategory] -= parseFloat(transaction.amount);
            }
            return acc;
        }, {});

        const formattedSubcategoryData = Object.keys(subcategoryData).map((subCategory) => {
            return {
                name: subCategory,
                value: subcategoryData[subCategory],
                color: categoryColors.find(c => c.label === category).color,
                icon: subcategoriesIcons[subCategory] || 'fa-solid fa-question'
            };
        });

        setSubCategoryData(formattedSubcategoryData);
    };

    const handleMouseLeave = () => {
        setHoveredCategory(null);
        setSubCategoryData([]);
    };

    const renderCustomizedLabel = useCallback(({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const RADIAN = Math.PI / 180;
        const radius = (innerRadius + outerRadius) / 2;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        const iconClass = chartData[index]?.icon || 'fa-solid fa-question';

        return (
            <g>
                <foreignObject x={x - 10} y={y - 10} width={20} height={20} style={{ overflow: "visible", pointerEvents: 'none' }}>
                    <i className={iconClass} style={{ color: "white" }}></i>
                </foreignObject>
            </g>
        );
    }, [chartData]);

    const renderSubcategoryLabel = useCallback(({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const RADIAN = Math.PI / 180;
        const radius = (innerRadius + outerRadius) / 2;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        const iconClass = subCategoryData[index]?.icon || 'fa-solid fa-question';

        return (
            <g>
                <foreignObject x={x - 10} y={y - 10} width={20} height={20} style={{ overflow: "visible", pointerEvents: 'none' }}>
                    <i className={iconClass} style={{ color: "white" }}></i>
                </foreignObject>
            </g>
        );
    }, [subCategoryData]);

    const Legend = ({ data }) => {
        return (
            <div className="legend">
                {data.map((entry, index) => (
                    <div key={index} className="legend-item">
                        <i className={entry.icon} style={{ color: entry.color, marginRight: '8px' }}></i>
                        <span className="legend-text">{`${Math.round(entry.value)}:-`}</span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div id="pie-chart-with-legend">
            <div className="time-period-buttons-pie">
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
            </div>
            <div className="pie-chart">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            innerRadius={65}
                            fill="#8884d8"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            paddingAngle={0}
                            isAnimationActive={false}
                            onMouseEnter={({ name }) => handleMouseEnter(name)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        {hoveredCategory && (
                            <Pie
                                data={subCategoryData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                innerRadius={100}
                                fill="#82ca9d"
                                labelLine={false}
                                label={renderSubcategoryLabel}
                                paddingAngle={0}
                                isAnimationActive={false}
                            >
                                {subCategoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        )}
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <Legend data={hoveredCategory ? subCategoryData : chartData} />
        </div>
    );
});

export default PieChartComponent;
