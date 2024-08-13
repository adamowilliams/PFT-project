import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useTransactions from './hooks/useTransactions.jsx';
// Pages
import { Login, Logout, Register, NoteApp, NotFound, Home, Dashboard, TransactionsPage } from "./pages/Index";
// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import NavBar from "./components/NavBar";
// Styles
import "./styles/PageContent.css";
import "./styles/NavBar.css";
import "./styles/Sidebar.css";


function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}


function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const { handleGetCurrentUser } = useTransactions();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('access'));

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  //This effect might be behaving odd when there is no refresh or access tokens available.
  //ODD BEHAVIOR: Can't logout when there is no refresh token available.
  useEffect(() => {
    // Get current user when login status changes
    if (!isLoggedIn) {
      console.log("No user logged in");
      return;
    }
    else {
      const fetchCurrentUser = async () => {
        console.log("Fetching current user");
        const username = await handleGetCurrentUser();
        setCurrentUser(username);
        console.log("Current User:", username);
      };

      fetchCurrentUser();
    }
  }, [isLoggedIn, handleGetCurrentUser]);
  


  return (
    <BrowserRouter>
      <div className="d-flex" id="wrapper">
        {isSidebarVisible && <Sidebar />}
        <div className="main-content">
          <NavBar
            currentUser={currentUser}
            toggleSidebar={toggleSidebar}
            isSidebarVisible={isSidebarVisible}
          />
          <div className="container-fluid">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home username={currentUser} />
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
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
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
