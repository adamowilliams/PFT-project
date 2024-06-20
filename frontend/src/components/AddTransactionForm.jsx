import React, { useEffect, useState } from 'react';
import api from '../api';
import Transaction from './Transaction';
import { fetchTransactions } from '../services/apiService.jsx';
import PropTypes from 'prop-types';
import '../styles/Dashboard.css';

const incomeCategories = [
  { value: 'Salary', label: 'Salary' },
  { value: 'Gift', label: 'Gift' },
  { value: 'Other', label: 'Other' }
];

const outcomeCategories = [
  { value: 'Food', label: 'Food' },
  { value: 'Transport', label: 'Transport' },
  { value: 'Rent', label: 'Rent' },
  { value: 'Bills', label: 'Bills' },
  { value: 'Health', label: 'Health' },
  { value: 'Fun', label: 'Fun' },
  { value: 'Charity', label: 'Charity' },
  { value: 'Other', label: 'Other' }
];

const repetitionIntervals = [
  { value: 'Daily', label: 'Daily' },
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Yearly', label: 'Yearly' },
  { value: 'None', label: 'None' }
];



const AddTransactionForm = ({ onTransactionAdded }) => {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    description: "",
    created_at: "",
    recurring: false,
    recurring_interval: 5, // Default to "None"
    transaction_type: "",
  });
  const [transactions, setTransactions] = useState([]);
  const [file, setFile] = useState(null);

  const fetchData = () => {
    fetchTransactions(setTransactions);
  };

  useEffect(() => {
    fetchData();
  }, []);


  const deleteTransaction = (id) => {
    api.delete(`/api/transactions/delete/${id}/`)
        .then(response => {
            if (response.status === 204) alert("Transaction deleted");
            else alert("Failed to delete transaction.");
            fetchData();
            onTransactionAdded();
        })
        .catch((error) => alert(error));
  };

  // Transaction form handlers and functions to the API
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Determine transaction type based on amount
    const transactionType = parseFloat(formData.amount) < 0 ? "Expense" : "Income";

    const dataToSend = {
      ...formData,
      amount: parseFloat(formData.amount),
      created_at: formData.created_at || new Date().toISOString().split('T')[0],
      transaction_type: transactionType,
    };

    api
      .post("/api/transactions/", dataToSend)
      .then((response) => {
        console.log("Transaction added:", response.data);
        fetchData();
        onTransactionAdded();
        // Clear the form after submission
        setFormData({
          amount: "",
          category: "",
          description: "",
          created_at: "",
          recurring: false,
          recurring_interval: 5,
          transaction_type: "",
        });
      })
      .catch((error) => {
        console.error("There was an error adding the transaction!", error);
      });
  };

  // File upload handlers and functions to the API
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    api.post('/api/transactions/import/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        console.log("Transaction added:", response.data);
        fetchData();
        setFile(null);
      })
      .catch(error => {
        console.error('There was an error uploading the file!', error);
        alert('Error uploading file');
      });
  };
  

  const categoryOptions =
    parseFloat(formData.amount) < 0 ? outcomeCategories : incomeCategories;

  return (
    <div className="transaction-form-container">
      <div id="recent_transactions">
        <h2>Transactions</h2>
        {transactions.map((transaction) => (
          <Transaction
            key={transaction.id}
            transaction={transaction}
            onDelete={deleteTransaction}
          />
        ))}
      </div>
      <div id="add_transaction">
      <form onSubmit={handleSubmit}>
        <h2>Add Transaction</h2>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Amount"
          required
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Select Category
          </option>
          {categoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="description"
          value={formData.description}
          placeholder="Description(optional)"
          onChange={handleChange}
        />
        <input
          type="date"
          name="created_at"
          value={formData.created_at}
          onChange={handleChange}
          placeholder='Specify date or leave empty for today'
        />
        <label>
          Recurring
          <input
            type="checkbox"
            name="recurring"
            checked={formData.recurring}
            onChange={handleChange}
          />
        </label>
        {formData.recurring && (
          <select
            name="recurring_interval"
            value={formData.recurring_interval}
            onChange={handleChange}
          >
            {repetitionIntervals.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
        <button type="submit">Add</button>
      </form>
      </div>
      <div id="import_transaction">
      <form onSubmit={handleFileSubmit}>
        <h2>Import Transactions</h2>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      </div>
    </div>
  );
}

AddTransactionForm.propTypes = {
  onTransactionAdded: PropTypes.func.isRequired,
};

export default AddTransactionForm;
