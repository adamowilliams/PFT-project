import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NoteApp from "./pages/NoteApp";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./pages/Sidebar";
import Home from "./pages/Home";
import "./styles/PageContent.css";
import "./styles/NavBar.css";
import { useState } from "react";
import Income from "./pages/Income";
import Dashboard from "./pages/Dashboard";

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
        <div id="page-content-wrapper">
          <div id="navbar-wrapper">
            <button onClick={toggleSidebar} id="button-head">
              <i className="fas fa-bars"></i>
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
                path="/transactions"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/income"
                element={
                  <ProtectedRoute>
                    <Income />
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
