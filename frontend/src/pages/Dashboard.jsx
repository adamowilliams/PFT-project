import React from 'react';
import { Link } from 'react-router-dom';
import AddTransactionForm from '../components/AddTransactionForm';


const Dashboard = () => {
    return (
        <div id="dashboard-wrapper" >
            <h1>Dashboard</h1>
            <AddTransactionForm />
        </div>
    );
}

export default Dashboard;
