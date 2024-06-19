import React from 'react';
import AddTransactionForm from '../components/AddTransactionForm';
import BalanceDisplay from '../components/BalanceDisplay';
import ActivityGraph from '../components/ActivityGraph';


const Dashboard = () => {
    return (
        <div id="dashboard-wrapper" >
            <h1>Dashboard</h1>
            <AddTransactionForm />
            <BalanceDisplay />
            <ActivityGraph />
        </div>
    );
}

export default Dashboard;
