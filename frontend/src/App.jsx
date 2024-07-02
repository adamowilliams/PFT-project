import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// Pages
import { Login, Register, NoteApp, NotFound, Home, Dashboard, TransactionsPage } from "./pages/Index";
// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
// Styles
import "./styles/PageContent.css";
import "./styles/NavBar.css";
import "./styles/Sidebar.css";


function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  const username = localStorage.getItem("username");

  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <BrowserRouter>
      <div className="d-flex" id="wrapper">
        {isSidebarVisible && <Sidebar />}
        <div className="main-content">
          <div id="navbar-wrapper">
            <button onClick={toggleSidebar} id="button-head">
              <i className={`fas ${isSidebarVisible ? 'fa-angle-left' : 'fa-angle-right'}`}></i>
            </button>
            {/* Navbar content */}
          </div>
          <div className="container-fluid">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home username={username} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/note-app"
                element={
                  <ProtectedRoute>
                    <NoteApp />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute>
                    <TransactionsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/register" element={<RegisterAndLogout />} />
              <Route path="*" element={<NotFound />}></Route>
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
