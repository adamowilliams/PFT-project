import React, { useState, useEffect } from 'react';
import '../styles/Transactions.css';

const incomeCategories = [
  { label: 'Salary', value: 'Salary' },
  { label: 'Savings', value: 'Savings' },
  { label: 'Support & Subsidies', value: 'Support & Subsidies' },
  { label: 'Swish', value: 'Swish' },
  { label: 'Gift', value: 'Gift' },
  { label: 'Other', value: 'Other' }
];

const outcomeCategories = [
  { label: 'Housing', value: 'Housing' },
  { label: 'Food & Drink', value: 'Food & Drink' },
  { label: 'Household', value: 'Household' },
  { label: 'Transport', value: 'Transport' },
  { label: 'Entertainment & Shopping', value: 'Entertainment & Shopping' },
  { label: 'Miscellaneous', value: 'Miscellaneous' }
];

const subCategories = {
  'Housing': ['Building & Garden', 'Rent & Fee'],
  'Food & Drink': ['Groceries', 'Cafe & Snacks', 'Restaurant & Bar', 'Alcohol & Tobacco'],
  'Household': ['Pets', 'Media, Mobile, and IT', 'Healthcare & Wellness'],
  'Transport': ['Vehicles & Fuel', 'Bus & Train'],
  'Entertainment & Shopping': ['Toys & Games', 'Culture & Entertainment', 'Beauty & Personal Care', 'Home Electronics', 'Clothes & Fashion', 'Vacation', 'Sports & Leisure'],
  'Miscellaneous': ['Swish', 'Savings', 'Investment']
};

function EditTransactionForm({ transaction, onSave, onCancel }) {
  const [updatedTransaction, setUpdatedTransaction] = useState({ ...transaction });
  const [availableSubcategories, setAvailableSubcategories] = useState(subCategories[transaction.category] || []);
  const [applyToAll, setApplyToAll] = useState(false);

  const categoryOptions = parseFloat(updatedTransaction.amount) < 0 ? outcomeCategories : incomeCategories;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTransaction(prevState => ({
      ...prevState,
      [name]: value
    }));

    if (name === 'category') {
      setAvailableSubcategories(subCategories[value] || []);
      setUpdatedTransaction(prevState => ({
        ...prevState,
        subCategory: subCategories[value] ? subCategories[value][0] : '' // Reset subcategory on category change
      }));
    }
  };

  useEffect(() => {
    setAvailableSubcategories(subCategories[updatedTransaction.category] || []);
  }, [updatedTransaction.category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const transactionType = parseFloat(updatedTransaction.amount) < 0 ? "Expense" : "Income";
    const dataToSave = {
      ...updatedTransaction,
      transaction_type: transactionType
    };
    onSave(dataToSave, applyToAll); // Pass the applyToAll state back to the parent
  };

  const handleCheckboxChange = (e) => {
    setApplyToAll(e.target.checked);
  };

  return (
    <div className="edit-transaction-form">
      <form onSubmit={handleSubmit}>
        <div className="category-div-edit-form">
          <label>
            Category:
            <select
              name="category"
              value={updatedTransaction.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categoryOptions.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {parseFloat(updatedTransaction.amount) < 0 && (
          <div className="subCategory-div-edit-form">
            <label>
              Subcategory:
              <select
                name="subCategory"
                value={updatedTransaction.subcategory}
                onChange={handleChange}
              >
                <option value="">Select Subcategory</option>
                {availableSubcategories.map((subcategory) => (
                  <option key={subcategory} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        <div className="editDesc-container">
          <label>
            Description:
            <input
              type="text"
              name="description"
              value={updatedTransaction.description}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="editAmount-container">
          <label>
            Amount:
            <input
              type="number"
              name="amount"
              value={updatedTransaction.amount}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="editDate-container">
          <label>
            Date:
            <input
              type="date"
              name="created_at"
              value={updatedTransaction.date}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="apply-all-container">
          <label htmlFor="apply-all-checkbox">Apply to all</label>
            <input 
            type="checkbox" 
            checked={applyToAll} 
            onChange={handleCheckboxChange} 
            id="apply-all-checkbox" 
          />
        </div>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
}

export default EditTransactionForm;
