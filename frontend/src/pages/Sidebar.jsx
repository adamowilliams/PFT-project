import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  
  return (
    <div className="" id="sidebar-wrapper">
      <div className="sidebar-heading">Adam's ProjectSpace</div>
      <div className="list-group">
        <Link className="list-group-item list-group-item-action" to="/note-app">Note App</Link>
        <Link className="list-group-item list-group-item-action" to="/transactions">Finance Tracker App</Link>
        {/* Add other links similarly */}
      </div>
    </div>
  );
};

export default Sidebar;
