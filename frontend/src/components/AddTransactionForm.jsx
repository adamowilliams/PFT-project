import React, { useEffect, useState } from 'react';
import api from '../api';
import Transaction from './Transaction';

const incomeCategories = [
    { value: 1, label: 'Salary' },
    { value: 2, label: 'Gift' },
    { value: 3, label: 'Other' }
];

const outcomeCategories = [
    { value: 1, label: 'Food' },
    { value: 2, label: 'Transport' },
    { value: 3, label: 'Rent' },
    { value: 4, label: 'Bills' },
    { value: 5, label: 'Health' },
    { value: 6, label: 'Fun' },
    { value: 7, label: 'Charity' },
    { value: 8, label: 'Other' }
];

const repetitionIntervals = [
    { value: 1, label: 'Daily' },
    { value: 2, label: 'Weekly' },
    { value: 3, label: 'Monthly' },
    { value: 4, label: 'Yearly' },
    { value: 5, label: 'None' }
];

function AddTransactionForm() {
  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    category: "",
    description: "",
    recurring: false,
    recurring_interval: 5, // Default to "None"
    transaction_type: "",
  });
  const [transactions, setTransactions] = useState([]); // [1

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    api.get('/api/transactions/')
      .then(response => {
        setTransactions(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the transactions!', error);
      });
  };

  const deleteTransaction = (id) => {
    api.delete(`/api/transactions/delete/${id}/`)
        .then(response => {
            if (response.status === 204) alert("Transaction deleted");
            else alert("Failed to delete transaction.");
            fetchTransactions();
        })
        .catch((error) => alert(error));
  };

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
    // Ensure amount is positive
    const amount = Math.abs(parseFloat(formData.amount));

    const dataToSend = {
      ...formData,
      amount: amount,
      transaction_type: transactionType,
      category: parseInt(formData.category, 10), // Ensure category is an integer
    };

    api
      .post("/api/transactions/", dataToSend)
      .then((response) => {
        console.log("Transaction added:", response.data);
        fetchTransactions();
        // Clear the form after submission
        setFormData({
          date: "",
          amount: "",
          category: "",
          description: "",
          recurring: false,
          recurring_interval: 5,
          transaction_type: "",
        });
      })
      .catch((error) => {
        console.error("There was an error adding the transaction!", error);
      });
  };

  const categoryOptions =
    parseFloat(formData.amount) < 0 ? outcomeCategories : incomeCategories;

  return (
    <div>
        <div id="recent_transactions">
        <h2>Transactions</h2>
            {transactions.map(transaction => (
                <Transaction key={transaction.id} transaction={transaction} onDelete={deleteTransaction} />
            ))}
        </div>
        <form onSubmit={handleSubmit}>
        <h2>Add Transaction</h2>
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder='Amount'
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
          placeholder='Description(optional)'
          onChange={handleChange}
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
  );
};

export default AddTransactionForm;
