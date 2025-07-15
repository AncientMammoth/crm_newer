import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import React, { useEffect } from "react";

// Page & Component Imports
import Login from "./pages/Login";
import DashboardLayout from "./components/layout/DashboardLayout";
import Home from "./pages/Home";
import Accounts from "./pages/Accounts";
import AccountDetail from "./pages/AccountDetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Updates from "./pages/Updates";
import UpdateDetail from "./pages/UpdateDetail";
import AccountCreation from "./pages/AccountCreation";
import ProjectCreation from "./pages/ProjectCreation";
import UpdateCreation from "./pages/UpdateCreation";
import TasksRouter from "./pages/TasksRouter";
import CreateTask from "./pages/CreateTask";
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';

// Admin Component Imports
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserList from './pages/AdminUserList';
import AdminProjectList from './pages/AdminProjectList';
import AdminTaskList from './pages/AdminTaskList';
import AdminAccountList from './pages/AdminAccountList';
import AdminUpdateList from './pages/AdminUpdateList';
import AdminUserDetail from './pages/AdminUserDetail';
import AdminAccountDetail from './pages/AdminAccountDetail';
import AdminProjectDetail from './pages/AdminProjectDetail';
import AdminCreateTask from './pages/AdminCreateTask';

/**
 * @description A route guard for all standard users.
 * Checks for a "secretKey" in localStorage. If it doesn't exist, the user is
 * redirected to the /login page.
 */
function PrivateRoute({ children }) {
  const secretKey = localStorage.getItem("secretKey");
  if (!secretKey) {
    return <Navigate to="/login" />;
  }
  return children;
}

/**
 * @description A route guard specifically for admin users.
 * Checks for both a "secretKey" and an "isAdmin" flag in localStorage.
 * If either is missing or "isAdmin" is not "true", the user is redirected to /login.
 */
function AdminPrivateRoute({ children }) {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const secretKey = localStorage.getItem("secretKey");
    if (!secretKey || !isAdmin) {
        return <Navigate to="/login" />;
    }
    return children;
}

/**
 * @description A gatekeeper component for the root path ('/').
 * When a user lands on the site, this component checks their login status and role
 * to redirect them to the correct dashboard. This is the core fix for the issue.
 */
function HomeRedirect() {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const secretKey = localStorage.getItem("secretKey");

    if (secretKey) {
        // If logged in, redirect based on role
        return isAdmin ? <Navigate to="/admin/dashboard" /> : <Navigate to="/home" />;
    }
    
    // If not logged in at all, send to login page
    return <Navigate to="/login" />;
}


export default function App() {
  return (
    <Routes>
      {/* Publicly accessible login page */}
      <Route path="/login" element={<Login />} />

      {/* The root path now uses the HomeRedirect to sort users */}
      <Route path="/" element={<HomeRedirect />} />

      {/* Standard User Routes, protected by PrivateRoute */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route path="home" element={<Home />} />
        <Route path="accounts" element={<Accounts />} /> 
        <Route path="accounts/:id" element={<AccountDetail />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="updates" element={<Updates />} />
        <Route path="updates/:id" element={<UpdateDetail />} />
        <Route path="create-account" element={<AccountCreation />} />
        <Route path="create-project" element={<ProjectCreation />} />
        <Route path="create-update" element={<UpdateCreation />} />
        <Route path="tasks" element={<TasksRouter />} />
        <Route path="create-task" element={<CreateTask />} />
        <Route path="my-tasks" element={<Tasks />} />
        <Route path="tasks/:taskId" element={<TaskDetail />} />
      </Route>

      {/* Admin Routes, protected by the more secure AdminPrivateRoute */}
      <Route
        path="/admin"
        element={
          <AdminPrivateRoute>
            <AdminLayout />
          </AdminPrivateRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUserList />} />
        <Route path="users/:id" element={<AdminUserDetail />} />
        <Route path="accounts" element={<AdminAccountList />} />
        <Route path="accounts/:id" element={<AdminAccountDetail />} />
        <Route path="projects" element={<AdminProjectList />} />
        <Route path="projects/:id" element={<AdminProjectDetail />} />
        <Route path="tasks" element={<AdminTaskList />} />
        <Route path="create-task" element={<AdminCreateTask />} />
        <Route path="updates" element={<AdminUpdateList />} />
      </Route>
    </Routes>
  );
}
