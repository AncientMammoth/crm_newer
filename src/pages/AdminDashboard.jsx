import React from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../components/layout/AdminNavbar';

const AdminDashboard = () => {
  return (
    <div>
      <AdminNavbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">Users</h2>
            <p>View and manage all users.</p>
            <Link to="/admin/users" className="text-blue-500 hover:underline">
              Manage Users
            </Link>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">Projects</h2>
            <p>View and manage all projects.</p>
            <Link to="/admin/projects" className="text-blue-500 hover:underline">
              Manage Projects
            </Link>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">Tasks</h2>
            <p>Create and assign tasks.</p>
            <Link to="/admin/tasks" className="text-blue-500 hover:underline">
              Manage Tasks
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;