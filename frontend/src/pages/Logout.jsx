import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

function Logout({ onLogout }) {
    
  useEffect(() => {
    // Perform logout actions after the component is rendered
    localStorage.clear();
    onLogout();
  }, [onLogout]);

  // Redirect to login after clearing the state
  return <Navigate to="/login" />;
}

export default Logout;