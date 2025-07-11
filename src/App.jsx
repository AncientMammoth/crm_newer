import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import { Toaster } from "sonner";

// This component checks if a user is logged in.
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// This component checks if the logged-in user is an admin.
const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  return (role === "admin") ? children : <Navigate to="/" replace />;
};

// This component checks if the logged-in user is a regular user.
const RegularUserRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  // If an admin tries to access a regular user page, redirect them to their dashboard.
  return (role !== "admin") ? children : <Navigate to="/admin" replace />;
};

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Admin Route: Must be logged in and have 'admin' role */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </ProtectedRoute>
          }
        />

        {/* Regular User Route: Must be logged in and NOT have 'admin' role */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <RegularUserRoute>
                <Home />
              </RegularUserRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
