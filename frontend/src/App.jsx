import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import BooksPage from './pages/BooksPage';

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Current time in seconds
        if (decoded.exp < currentTime) {
          // Token has expired
          localStorage.removeItem('token'); // Remove token from storage
          alert('Session expired. Please log in again.');
          navigate('/login'); // Redirect to login
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        navigate('/');
      }
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/books" element={<BooksPage />}/>
    </Routes>
  );
};

export default App;