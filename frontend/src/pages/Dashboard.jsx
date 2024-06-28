import React, { useEffect} from 'react';
import { 
    AddTransactionForm, 
    BalanceDisplay, 
    ActivityGraph, 
    PieChartComponent 
} from "../components/Index";
import { fetchTransactions, fetchImportedTransactions } from '../services/apiService';
import '../styles/Dashboard.css';


const Dashboard = () => {
    const balanceDisplayRef = React.useRef(null);
    const graphRef = React.useRef(null);
    const pieChartRef = React.useRef(null);
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
    };

    useEffect(() => {
        fetchTransactions(setTransactions);
        fetchImportedTransactions(setTransactions);
    }, []);

    return (
        <div id="dashboard-wrapper" >
            <BalanceDisplay ref={balanceDisplayRef} transactions={transactions}>
                <PieChartComponent ref={pieChartRef} transactions={transactions}/>
            </BalanceDisplay>
            <ActivityGraph ref={graphRef} transactions={transactions}/>
            <AddTransactionForm onTransactionAdded={handleTransactionAdded} />
        </div>
    );
}

export default Dashboard;
