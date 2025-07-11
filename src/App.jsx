import React from "react";
// The Router (aliased as BrowserRouter) is no longer imported or used here
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import { Toaster } from "sonner";

// A component to protect routes that require a user to be logged in
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

// A component to protect routes that require admin privileges
const AdminRoute = ({ children }) => {
  const role = localStorage.getItem("role");
  return role === "admin" ? children : <Navigate to="/" />;
};

function App() {
  return (
    // The <TooltipProvider> and <Router> wrappers are removed from this file
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        {/* Publicly accessible Login route */}
        <Route path="/login" element={<Login />} />

        {/* Protected route for the main user dashboard */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Protected route for the admin dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
