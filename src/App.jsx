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
  // It also ensures a token exists, adding an extra layer of security.
  const token = localStorage.getItem("token");
  if (token && role === "admin") {
    return children;
  }
  // If not an admin, redirect them away.
  return <Navigate to="/" replace />;
};

// This component handles the main application layout for regular users.
const UserRoutes = () => {
    const role = localStorage.getItem("role");
    // If a logged-in user is an admin, redirect them from regular pages to their dashboard.
    if (role === 'admin') {
        return <Navigate to="/admin" replace />;
    }
    return <Home />;
}

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <UserRoutes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
