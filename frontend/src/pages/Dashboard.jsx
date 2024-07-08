import React, { useEffect } from 'react';
import {
    AddTransactionForm,
    BalanceDisplay,
    ActivityGraph,
    PieChartComponent,
    RecentTransactions,
    Calendar
} from "../components/Index";
import '../styles/Dashboard.css';
import useTransactions from '../hooks/useTransactions';


const Dashboard = () => {
    const balanceDisplayRef = React.useRef(null);
    const graphRef = React.useRef(null);
    const pieChartRef = React.useRef(null);
    const recentTransactionsRef = React.useRef(null);
    const calendarRef = React.useRef(null);

    const {
        transactions,
        loading,
        error,
        handleGetTransactions,
        handleGetImportedTransactions,
    } = useTransactions();

    const handleTransactionAdded = () => {
        handleGetTransactions();
        handleGetImportedTransactions();
        if (balanceDisplayRef.current) {
            balanceDisplayRef.current.fetchData();
        }
        if (graphRef.current) {
            graphRef.current.fetchData();
        }
        if (pieChartRef.current) {
            pieChartRef.current.fetchData();
        }
        if (recentTransactionsRef.current) {
            recentTransactionsRef.current.fetchData();
        }
        if (calendarRef.current) {
            calendarRef.current.fetchData();
        }
    };

    useEffect(() => {
        handleGetTransactions();
        handleGetImportedTransactions();
    }
        , []);

    return (
        <div id="dashboard-wrapper" >
            <BalanceDisplay ref={balanceDisplayRef} transactions={transactions}>
                <PieChartComponent ref={pieChartRef} transactions={transactions} />
            </BalanceDisplay>
            <Calendar ref={calendarRef} transactions={transactions} />
            <AddTransactionForm handleTransactionAdded={handleTransactionAdded} />
            <ActivityGraph ref={graphRef} transactions={transactions} />
            <RecentTransactions ref={recentTransactionsRef} transactions={transactions} />
        </div>
    );
}

export default Dashboard;
