import React, { useEffect} from 'react';
import { 
    AddTransactionForm, 
    BalanceDisplay, 
    ActivityGraph, 
    PieChartComponent,
    RecentTransactions
} from "../components/Index";
import { fetchTransactions, fetchImportedTransactions } from '../services/apiService';
import '../styles/Dashboard.css';


const Dashboard = () => {
    const balanceDisplayRef = React.useRef(null);
    const graphRef = React.useRef(null);
    const pieChartRef = React.useRef(null);
    const recentTransactionsRef = React.useRef(null);
    const [transactions, setTransactions] = React.useState([]);

    const handleTransactionAdded = () => {
        fetchTransactions(setTransactions);
        fetchImportedTransactions(setTransactions);
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
    };

    useEffect(() => {
        fetchTransactions(setTransactions);
        fetchImportedTransactions(setTransactions);
    }, []);

    return (
        <div id="dashboard-wrapper" >
            <AddTransactionForm onTransactionAdded={handleTransactionAdded} />
            <BalanceDisplay ref={balanceDisplayRef} transactions={transactions}>
                <PieChartComponent ref={pieChartRef} transactions={transactions}/>
            </BalanceDisplay>
            <RecentTransactions ref={recentTransactionsRef} transactions={transactions}/>
            <ActivityGraph ref={graphRef} transactions={transactions}/>
            
            
        </div>
    );
}

export default Dashboard;
