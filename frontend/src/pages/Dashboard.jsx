import React, { useEffect} from 'react';
import AddTransactionForm from '../components/AddTransactionForm';
import BalanceDisplay from '../components/BalanceDisplay';
import ActivityGraph from '../components/ActivityGraph';
import { fetchTransactions } from '../services/apiService';
import '../styles/Dashboard.css';


const Dashboard = () => {
    const balanceDisplayRef = React.useRef(null);
    const graphRef = React.useRef(null);
    const [transactions, setTransactions] = React.useState([]);

    const handleTransactionAdded = () => {
        fetchTransactions(setTransactions);
        if (balanceDisplayRef.current) {
            balanceDisplayRef.current.fetchData();
        }
        if (graphRef.current) {
            graphRef.current.fetchData();
        }
    };

    useEffect(() => {
        fetchTransactions(setTransactions);
    }, []);

    return (
        <div id="dashboard-wrapper" >
            <h1>Dashboard</h1>
            <BalanceDisplay ref={balanceDisplayRef} transactions={transactions}/>
            <ActivityGraph ref={graphRef} transactions={transactions}/>
            <AddTransactionForm onTransactionAdded={handleTransactionAdded} />
        </div>
    );
}

export default Dashboard;
