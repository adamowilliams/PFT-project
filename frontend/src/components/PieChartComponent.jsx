import React, { useState, useEffect, useImperativeHandle, forwardRef, useCallback, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer} from 'recharts';
import '../styles/Dashboard.css';

const PieChartComponent = forwardRef(({ transactions = [] }, ref) => {
    const [chartData, setChartData] = useState([]);
    const [hoveredCategoryIndex, setHoveredCategoryIndex] = useState(null);
    //const [hoveredCategory, setHoveredCategory] = useState(null);
    //const [subCategoryData, setSubCategoryData] = useState([]);

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
        const groupedData = transactions.reduce((acc, transaction) => {
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
    }, [transactions]);

    useImperativeHandle(ref, () => ({
        fetchData
    }));

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const renderCustomizedLabel = useCallback(({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const RADIAN = Math.PI / 180;
        const radius = (innerRadius + outerRadius) / 2;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        const iconClass = chartData[index]?.icon || 'fa-solid fa-question';
/*
        let iconClass;
        if (hoveredCategoryIndex !== null && index >= hoveredCategoryIndex && index < hoveredCategoryIndex + subCategoryData.length) {
            const subIndex = index - hoveredCategoryIndex;
            iconClass = subcategoriesIcons[subCategoryData[subIndex]?.name] || 'fa-solid fa-question';
        } else {
            
        }
*/

        return (
            <g>
                <foreignObject x={x - 10} y={y - 10} width={20} height={20} style={{ overflow: "visible", pointerEvents: 'none' }}>
                    <i className={iconClass} style={{ color: "white" }}></i>
                </foreignObject>
            </g>
        );
    }, [chartData]);

           /*
    const handleMouseEnter = (data, index) => {
        setHoveredCategoryIndex(categoryIndex);
 
        const categoryName = subcategories[data.name] ? data.name : hoveredCategory;
        const categoryIndex = subcategories[data.name] ? index : hoveredCategoryIndex;

        if (categoryName) {
            setHoveredCategory(categoryName);
            

            const subcategoryData = transactions.reduce((acc, transaction) => {
                if (transaction.transaction_type === 'Expense' && transaction.category === categoryName) {
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
                    color: chartData[categoryIndex].color,
                    icon: subcategoriesIcons[subCategory] || 'fa-solid fa-question'
                };
            });

            setSubCategoryData(formattedSubcategoryData);
        }
        
    };*/
    

    const memoizedChartData = useMemo(() => {
        return chartData.map((entry, index) => ({
            ...entry,
            isHovered: index === hoveredCategoryIndex
        }));
    }, [chartData, hoveredCategoryIndex]);

    const handleMouseEnter = (index) => {
        setHoveredCategoryIndex(index);
    };

    const handleMouseLeave = () => {
        setHoveredCategoryIndex(null);
    };

    const Legend = ({ data }) => {
        return (
            <div className="legend">
                {data.map((entry, index) => (
                    <div key={index} className="legend-item">
                        <i className={entry.icon} style={{ color: entry.color, marginRight: '8px' }}></i>
                        <span className="legend-text">{`${entry.name}: ${Math.round(entry.value)}:-`}</span>
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
                            data={/*hoveredCategoryIndex !== null ? [
                                ...chartData.slice(0, hoveredCategoryIndex),
                                ...subCategoryData,
                                ...chartData.slice(hoveredCategoryIndex + 1)
                            ] : */memoizedChartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={125}
                            innerRadius={80}
                            fill="#8884d8"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            paddingAngle={0}
                            isAnimationActive={false} // Disable animations
                            onMouseEnter={(index) => handleMouseEnter(index)}
                            onMouseLeave={handleMouseLeave}
                        >
                            {/*(hoveredCategoryIndex !== null ? [
                                ...chartData.slice(0, hoveredCategoryIndex),
                                ...subCategoryData,
                                ...chartData.slice(hoveredCategoryIndex + 1)
                            ] :*/ memoizedChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <Legend
                data={/*hoveredCategoryIndex !== null ? subCategoryData :*/ chartData}
            />
        </div>
    );
});

export default PieChartComponent;
