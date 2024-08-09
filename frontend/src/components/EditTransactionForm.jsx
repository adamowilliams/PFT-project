import React, { useState, useEffect } from 'react';
import '../styles/Transactions.css';

const categoryColors = [
  { label: 'Housing', color: '#FFC107', icon: 'fa-solid fa-home' },
  { label: 'Food & Drink', color: '#4CAF50', icon: 'fa-solid fa-utensils' },
  { label: 'Household', color: '#673AB7', icon: 'fa-solid fa-couch' },
  { label: 'Transport', color: '#FF9800', icon: 'fa-solid fa-car' },
  { label: 'Entertainment & Shopping', color: '#E91E63', icon: 'fa-solid fa-shopping-bag' },
  { label: 'Miscellaneous', color: '#9E9E9E', icon: 'fa-solid fa-box-open' }
];

const subCategories = {
  'Housing': ['Building & Garden', 'Rent & Fee'],
  'Food & Drink': ['Groceries', 'Cafe & Snacks', 'Restaurant & Bar', 'Alcohol & Tobacco'],
  'Household': ['Pets', 'Media, Mobile, and IT', 'Healthcare & Wellness'],
  'Transport': ['Vehicles & Fuel', 'Bus & Train'],
  'Entertainment & Shopping': ['Toys & Games', 'Culture & Entertainment', 'Beauty & Personal Care', 'Home Electronics', 'Clothes & Fashion', 'Vacation', 'Sports & Leisure'],
  'Miscellaneous': ['Swish']
};

function EditTransactionForm({ transaction, onSave, onCancel }) {
  const [updatedTransaction, setUpdatedTransaction] = useState({ ...transaction });
  const [availableSubcategories, setAvailableSubcategories] = useState(subCategories[transaction.category] || []);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated transaction data:", updatedTransaction);
    onSave(updatedTransaction);
  };

  useEffect(() => {
    setAvailableSubcategories(subCategories[updatedTransaction.category] || []);
  }, [updatedTransaction.category]);

  return (
    <div className="edit-transaction-form">
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Category:
            <select
              name="category"
              value={updatedTransaction.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categoryColors.map((category) => (
                <option key={category.label} value={category.label}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
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
        <div>
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
        <div>
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
        <div>
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
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
}

export default EditTransactionForm;
