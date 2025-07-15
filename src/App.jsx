import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./components/layout/DashboardLayout";
import Home from "./pages/Home";
import Accounts from "./pages/Accounts";
import AccountDetail from "./pages/AccountDetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Updates from "./pages/Updates";
import React from "react";
import UpdateDetail from "./pages/UpdateDetail";
import AccountCreation from "./pages/AccountCreation";
import ProjectCreation from "./pages/ProjectCreation";
import UpdateCreation from "./pages/UpdateCreation";
import TasksRouter from "./pages/TasksRouter";
import CreateTask from "./pages/CreateTask";
import Tasks from './pages/Tasks';
import TaskDetail from './pages/TaskDetail';

// Admin Components
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserList from './pages/AdminUserList';
import AdminProjectList from './pages/AdminProjectList';
import AdminTaskList from './pages/AdminTaskList';
import AdminAccountList from './pages/AdminAccountList';
import AdminUpdateList from './pages/AdminUpdateList';
import AdminUserDetail from './pages/AdminUserDetail';
import AdminAccountDetail from './pages/AdminAccountDetail';

function PrivateRoute({ children }) {
  const secretKey = localStorage.getItem("secretKey");
  if (!secretKey) {
    return <Navigate to="/login" />;
  }
  return children;
}

function AdminPrivateRoute({ children }) {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const secretKey = localStorage.getItem("secretKey");
    if (!secretKey || !isAdmin) {
        return <Navigate to="/login" />;
    }
    return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Home />} />
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
        <Route path="tasks" element={<AdminTaskList />} />
        <Route path="updates" element={<AdminUpdateList />} />
      </Route>
    </Routes>
  );
}
