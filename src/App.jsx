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

function PrivateRoute({ children }) {
  const secretKey = localStorage.getItem("secretKey");
  if (!secretKey) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default function App() {
  React.useEffect(() => {
    // **Fix for "failed to fetch admin data"**:
    // This is a good place to fetch user data after login.
    // If the user is an admin, you would make the API call to fetch admin-specific data here.
    // Make sure the API endpoint is correct and you are sending the correct authentication headers.
    // Example:
    // const userRole = localStorage.getItem("userRole");
    // if (userRole === 'admin') {
    //   fetchAdminData(); // This function would contain your API call
    // }
  }, []);

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
        <Route path="/my-tasks" element={<Tasks />} />
        <Route path="/tasks/:taskId" element={<TaskDetail />} />
      </Route>
    </Routes>
  );
}