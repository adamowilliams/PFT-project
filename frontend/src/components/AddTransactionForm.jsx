import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import useTransactions from '../hooks/useTransactions.jsx';
import ExcelJS from 'exceljs';


const incomeCategories = [
  { value: 'Salary', label: 'Salary' },
  { value: 'Savings', label: 'Savings' },
  { value: 'Support & Subsidies', label: 'Support & Subsidies' },
  { value: 'Swish', label: 'Swish' },
  { value: 'Gift', label: 'Gift' },
  { value: 'Other', label: 'Other' }
];

const outcomeCategories = [
  { value: 'Housing', label: 'Housing' },
  { value: 'Food & Drink', label: 'Food & Drink' },
  { value: 'Household', label: 'Household' },
  { value: 'Transport', label: 'Transport' },
  { value: 'Entertainment & Shopping', label: 'Entertainment & Shopping' },
  { value: 'Miscellaneous', label: 'Miscellaneous' }
];

const subcategories = {
  'Housing': ['Building & Garden', 'Rent & Fee'],
  'Food & Drink': ['Groceries', 'Cafe & Snacks', 'Restaurant & Bar', 'Alcohol & Tobacco'],
  'Household': ['Pets', 'Media, Mobile, and IT', 'Healthcare & Health'],
  'Transport': ['Vehicles & Fuel', 'Bus & Train'],
  'Entertainment & Shopping': ['Toys & Games', 'Culture & Entertainment', 'Beauty & Health', 'Home Electronics', 'Clothes & Fashion', 'Vacation', 'Sports & Leisure'],
  'Miscellaneous': ['Swish', 'Savings', 'Investment']
};


const AddTransactionForm = ({ handleTransactionAdded }) => {
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    subCategory: "",
    description: "",
    created_at: "",
    transaction_type: "",
  });
  const [file, setFile] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);

  const {
    transactions,
    loading,
    error,
    handleCreateTransaction,
    handleImportTransactions,
  } = useTransactions();

  // Transaction form handlers and functions
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  useEffect(() => {
    if (parseFloat(formData.amount) < 0 && formData.category) {
      const selectElement = document.getElementById('subCategory');
      if (selectElement) {
        selectElement.innerHTML = ''; // Clear existing options

        if (subcategories[formData.category]) {
          subcategories[formData.category].forEach(subcategory => {
            const option = document.createElement('option');
            option.value = subcategory;
            option.textContent = subcategory;
            selectElement.appendChild(option);
          });

          setFormData(formData => ({
            ...formData,
            subCategory: subcategories[formData.category][0]
          }));
        }
      }
    }
  }, [formData.category, formData.amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const transactionType = parseFloat(formData.amount) < 0 ? "Expense" : "Income";
    const dataToSend = {
      ...formData,
      amount: parseFloat(formData.amount),
      created_at: formData.created_at || new Date().toISOString().split('T')[0],
      transaction_type: transactionType,
      category: formData.category,
      subCategory: formData.subCategory
    };

    try {
      const response = await handleCreateTransaction(dataToSend);
      if (response.status === 201) {
        handleTransactionAdded();
        setFormData({
          amount: '',
          category: '',
          subCategory: '',
          description: '',
          created_at: '',
          transaction_type: '',
        });
      } else {
        alert('Failed to create transaction');
      }
    } catch (error) {
      console.error('There was an error adding the transaction!', error);
    }
  };

  useEffect(() => {
    setFormData({
      ...formData,
      category: '',
      subCategory: ''
    });
  }, [formData.amount]);

  // File upload handlers and functions
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(arrayBuffer);

        const worksheet = workbook.worksheets[0];
        const json = [];

        worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
          const rowValues = row.values;
          json.push(rowValues);
        });

        console.log("File content:", json);
      };
      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    for (let [key, file] of formData.entries()) {
      console.log(`${key}: name=${file.name}, size=${file.size}, type=${file.type}`);
    }

    try {
      const response = await handleImportTransactions(formData);
      if (response.status === 201) {
        handleTransactionAdded();
        setFile(null);
      } else {
        alert('Failed to upload file');
      }
    } catch (error) {
      console.error('There was an error uploading the file!', error);
    }

  };


  const categoryOptions =
    parseFloat(formData.amount) < 0 ? outcomeCategories : incomeCategories;


  return (
    <div className="transaction-form-container">
      <div className="form-dropdown-container">
        <h2><button onClick={() => {
          if (showImportForm) setShowImportForm(false);
          setShowAddForm(!showAddForm)
        }}><i className="fas fa-plus icon-space"></i> Create Transaction</button>
          <button onClick={() => {
            if (showAddForm) setShowAddForm(false);
            setShowImportForm(!showImportForm)
          }}><i className="fas fa-cloud-upload-alt icon-space"></i> Import Transaction</button>
        </h2>
        {showAddForm && (
          <div id="add_transaction">
            <form onSubmit={handleSubmit}>
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
              {parseFloat(formData.amount) < 0 && (
                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  id="subCategory"
                >
                  <option value="" disabled>
                    Subcategory
                  </option>

                </select>
              )}
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
                placeholder='Specify date or leave empty for today' //doesnt work
              />
              <button type="submit">Add</button>
            </form>
          </div>
        )}
        {showImportForm && (
          <div id="import_transaction">
            <form onSubmit={handleFileSubmit}>
              <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
              <button type="submit">Upload</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddTransactionForm;
