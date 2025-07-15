import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllUsersForAdmin } from '../api';

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await fetchAllUsersForAdmin();
        setUsers(fetchedUsers);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Could not load user data.");
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 bg-red-100 border border-red-400 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div className="px-4 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A list of all the users in the system including their name and role.
          </p>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-border ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-secondary/50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-foreground sm:pl-6">User Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {users.map((user) => (
                    <tr 
                        key={user.id} 
                        className="hover:bg-secondary/50 cursor-pointer"
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-foreground sm:pl-6">{user.fields['User Name']}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                          user.fields['User Type'] === 'admin' 
                          ? 'bg-green-400/10 text-green-400 ring-1 ring-inset ring-green-400/20' 
                          : 'bg-blue-400/10 text-blue-400 ring-1 ring-inset ring-blue-400/30'
                        }`}>
                          {user.fields['User Type']}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
