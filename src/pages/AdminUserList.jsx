import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/layout/AdminNavbar';
import { api } from '../api';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/admin/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <AdminNavbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        <div className="bg-white p-4 rounded-lg shadow">
          <ul>
            {users.map((user) => (
              <li key={user.id} className="border-b py-2">
                <p className="font-bold">{user.username}</p>
                <p>Email: {user.email}</p>
                <p>User Type: {user.user_type}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminUserList;