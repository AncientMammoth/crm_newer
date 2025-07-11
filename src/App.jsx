import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // No need to import BrowserRouter here
import Home from './pages/Home';
import Login from './pages/Login';
import Accounts from './pages/Accounts';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Updates from './pages/Updates';
import AccountDetail from './pages/AccountDetail';
import ProjectDetail from './pages/ProjectDetail';
import TaskDetail from './pages/TaskDetail';
import AdminDashboard from './pages/AdminDashboard'; 

// This component will protect routes that require admin access
const AdminRoute = ({ children }) => {
  const userType = localStorage.getItem('userType');
  // If the user is an admin, render the children components (the protected page)
  // Otherwise, redirect them to the home page
  return userType === 'admin' ? children : <Navigate to="/" />;
};

// This component protects routes that require any user to be logged in
const ProtectedRoute = ({ children }) => {
    const userKey = localStorage.getItem('secretKey');
    return userKey ? children : <Navigate to="/login" />;
};


function App() {
  // CORRECT: The <Router> component has been removed from this file.
  // It is now only in src/main.jsx
  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Regular User Routes - Protected */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/accounts" element={<ProtectedRoute><Accounts /></ProtectedRoute>} />
        <Route path="/accounts/:id" element={<ProtectedRoute><AccountDetail /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/tasks/:id" element={<ProtectedRoute><TaskDetail /></ProtectedRoute>} />
        <Route path="/updates" element={<ProtectedRoute><Updates /></ProtectedRoute>} />

        {/* ### NEW: Admin Route ### */}
        {/* This route is wrapped in the AdminRoute component */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        
        {/* Fallback route - maybe redirect to home or a 404 page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
}

export default App;