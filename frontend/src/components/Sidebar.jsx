import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";


const Sidebar = () => {
  const [dropdowns, setDropdowns] = useState({
    "Notes": false,
    "Finance Tracker": false,
  });

  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const toggleDropdown = (dropdownId, links) => {
    if (!isActive(links[0].path)) {
      setDropdowns((prev) => {
        const newDropdowns = {};
        for (const key in prev) {
          newDropdowns[key] = key === dropdownId ? !prev[key] : false;
        }
        return newDropdowns;
      });
    }
  };

  // DropdownButton component for the sidebar menu for easy reusability
  const DropdownButton = ({ mainLabel, mainPath, dropdownState, links }) => {
    return (
      <>
        <div
          className={`dropdown-toggle-container ${
            isActive(mainPath) ? "active" : ""
          }`}
        >
          <Link
            to={mainPath}
            className="dropdown-toggle"
            onClick={() => toggleDropdown(mainLabel, links)}
          >
            {mainLabel}
          </Link>
        </div>
        {dropdownState && (
          <div className="dropdown-container">
            {links.map((link) => (
              <div
                key={link.subLabel}
                className={`dropdown-item-container ${
                  isActive(link.path) ? "active" : ""
                }`}
              >
                <Link className="dropdown-item" to={link.path}>
                  {link.subLabel}
                </Link>
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="" id="sidebar-wrapper">
      <div className="sidebar-heading">
        <div className="sidebar-heading-text">
          <h2> ProjectSpace </h2>
        </div>
      </div>
      <div className="sidebar-menu">
        <DropdownButton
          mainLabel="Notes"
          mainPath="/note-app"
          dropdownState={dropdowns["Notes"]}
          links={[]}
        />
        <DropdownButton
          mainLabel="Finance Tracker"
          mainPath="/dashboard"
          dropdownState={dropdowns["Finance Tracker"]}
          links={[
            {
              path: "/transactions",
              subLabel: "Transactions",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Sidebar;
