import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // If no token is found, redirect to the login page
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);

    // Check if the user's role matches the required role
    if (requiredRole && decoded.role !== requiredRole) {
      alert('Access Denied: Insufficient permissions.');
      return <Navigate to="/" />;
    }

    return children; // Render the protected route
  } catch (error) {
    console.error('Invalid token:', error);
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  }
};  

export default ProtectedRoute;
