import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../styles/NavBar.css";

const NavBar = ({ currentUser, toggleSidebar, isSidebarVisible}) => {
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

  const toggleLogoutVisibility = () => {
    setShowLogout(!showLogout);
  };

  const handleNavigate = async () => {
    setShowLogout(false);
    navigate('/logout');
  };


  return (
    <div id="navbar-wrapper">
      <button onClick={toggleSidebar} id="button-head">
        <i className={`fas ${isSidebarVisible ? 'fa-angle-left' : 'fa-angle-right'}`}></i>
      </button>
      <div className="username-navbar" style={{ display: 'flex', alignItems: 'center' }}>
        <span>{currentUser ? currentUser : 'Guest'}</span>
        <i 
          className={`fas ${showLogout ? 'fa-frown' : 'fa-smile'}`}  // Toggle between smiley and sad face
          style={{ margin: '10px', cursor: 'pointer' }} 
          onClick={toggleLogoutVisibility}
        ></i>
        {showLogout && currentUser && (
          <button onClick={handleNavigate} className="logout-button">
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
