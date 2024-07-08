import React from 'react';

const categoryColors = [
  { label: 'Housing', color: '#FFC107', icon: 'fa-solid fa-home' },
  { label: 'Food & Drink', color: '#4CAF50', icon: 'fa-solid fa-utensils' },
  { label: 'Household', color: '#673AB7', icon: 'fa-solid fa-couch' },
  { label: 'Transport', color: '#FF9800', icon: 'fa-solid fa-bus' },
  { label: 'Entertainment & Shopping', color: '#E91E63', icon: 'fa-solid fa-shopping-bag' },
  { label: 'Miscellaneous', color: '#9E9E9E', icon: 'fa-solid fa-ellipsis-h' }
];

const subcategoriesIcons = {
  'Building & Garden': 'fa-solid fa-tree',
  'Rent & Fee': 'fa-solid fa-file-invoice',
  'Groceries': 'fa-solid fa-apple-alt',
  'Cafe & Snacks': 'fa-solid fa-coffee',
  'Restaurant & Bar': 'fa-solid fa-utensils',
  'Alcohol & Tobacco': 'fa-solid fa-wine-bottle',
  'Pets': 'fa-solid fa-dog',
  'Media, Mobile, and IT': 'fa-solid fa-mobile-alt',
  'Healthcare & Wellness': 'fa-solid fa-heartbeat',
  'Vehicles & Fuel': 'fa-solid fa-gas-pump',
  'Bus & Train': 'fa-solid fa-bus',
  'Toys & Games': 'fa-solid fa-gamepad',
  'Culture & Entertainment': 'fa-solid fa-theater-masks',
  'Beauty & Personal Care': 'fa-solid fa-spa',
  'Home Electronics': 'fa-solid fa-tv',
  'Clothes & Fashion': 'fa-solid fa-tshirt',
  'Vacation': 'fa-solid fa-plane',
  'Sports & Leisure': 'fa-solid fa-futbol',
  'Swish': 'fa-solid fa-mobile-alt'
};

function getCategoryData(category) {
  return categoryColors.find(cat => cat.label === category);
}

function getSubcategoryIcon(subCategory) {
  return subcategoriesIcons[subCategory] || null;
}

function Transaction({ transaction, children }) {
  const categoryData = getCategoryData(transaction.category);
  const subCategoryIcon = getSubcategoryIcon(transaction.subCategory);

  return (
    <div className="transaction">
      <h3 style={{ color: categoryData ? categoryData.color : 'black' }}>
        {categoryData && <i className={categoryData.icon}></i>}
      </h3>
      <h3 style={{ color: categoryData ? categoryData.color : 'black' }}>
        {subCategoryIcon && <i className={subCategoryIcon}></i>}
      </h3>
      <p id="transactionDescription"> {transaction.description}</p>
      <p>{transaction.amount}:-</p>
      <p id="transactionDate"> {transaction.created_at}</p>
      {children}
    </div>
  );
}

export default Transaction;
