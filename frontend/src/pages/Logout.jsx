import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

function Logout({ onLogout }) {
    
  useEffect(() => {
    onLogout();
  }, [onLogout]);

  console.log("Logging out");
  // Redirect to login after clearing the state
  return <Navigate to="/login" />;
}

export default Logout;