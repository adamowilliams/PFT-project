import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {

  const [dropdowns, setDropdowns] = useState({
    notes: false,
    financeTracker: false,
  });

  const toggleDropdown = (dropdownId) => {
    setDropdowns(prev => ({ ...prev, [dropdownId]: !prev[dropdownId] }));
  };

  return (
    <div className="" id="sidebar-wrapper">
      <div className="sidebar-heading">Adam&apos;s ProjectSpace</div>
      <div className="list-group">
        <button className="list-group-item list-group-item-action" onClick={() => toggleDropdown('notes')}>🏠 Notes</button>
        {dropdowns.notes && (
          <div className="dropdown">
            <div className="dropdown-menu show">
              <Link className="dropdown-item" to="/note-app">Home</Link>
            </div>
          </div>
        )}
        {}
        <div className={`spacing-element ${dropdowns.notes ? 'expanded' : ''}`}></div>
        <button className="list-group-item list-group-item-action" onClick={() => toggleDropdown('financeTracker')}>🏠 Finance Tracker</button>
        {dropdowns.financeTracker && (
          <div className="dropdown">
            <div className="dropdown-menu show">
              <Link className="dropdown-item" to="/dashboard">Home</Link>
              <Link className="dropdown-item" to="/transactions">Transactions</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
