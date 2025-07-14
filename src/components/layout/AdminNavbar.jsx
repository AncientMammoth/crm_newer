import React from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/admin/dashboard" className="text-xl font-bold">
          Admin Panel
        </Link>
        <div>
          <Link to="/admin/users" className="px-3 hover:text-gray-300">
            Users
          </Link>
          <Link to="/admin/projects" className="px-3 hover:text-gray-300">
            Projects
          </Link>
          <Link to="/admin/tasks" className="px-3 hover:text-gray-300">
            Tasks
          </Link>
          <Link to="/" className="px-3 hover:text-gray-300">
            Website
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;