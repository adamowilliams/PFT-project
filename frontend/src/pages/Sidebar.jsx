import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="border-end bg-white" id="sidebar-wrapper">
      <div className="sidebar-heading border-bottom bg-light">Adam's ProjectSpace</div>
      <div className="list-group list-group-flush">
        <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/NoteApp">Note App</Link>
        <Link className="list-group-item list-group-item-action list-group-item-light p-3" to="/shortcuts">Shortcuts</Link>
        {/* Add other links similarly */}
      </div>
    </div>
  );
};

export default Sidebar;
