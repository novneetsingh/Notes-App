import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Error from "./Pages/Error";
import { jwtDecode } from "jwt-decode";

const App = () => {
  const navigate = useNavigate();

  // Check if user is logged in and token is valid
  const isLoggedIn = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // Check if token is expired
      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("authToken");
        navigate("/login");
        return false;
      }

      return true;
    }

    return false;
  };

  return (
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route
        path="/login"
        element={isLoggedIn() ? <Navigate to="/dashboard" /> : <Login />}
      />

      <Route
        path="/dashboard/*"
        element={isLoggedIn() ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default App;
