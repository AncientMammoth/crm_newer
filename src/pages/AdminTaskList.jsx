import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/layout/AdminNavbar';
import { api } from '../api';

const AdminTaskList = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/admin/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div>
      <AdminNavbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Tasks</h1>
        {/* Add task creation form here */}
        <div className="bg-white p-4 rounded-lg shadow">
          <ul>
            {tasks.map((task) => (
              <li key={task.id} className="border-b py-2">
                <p className="font-bold">{task.title}</p>
                <p>Description: {task.description}</p>
                <p>Assigned to: {task.assigned_to}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminTaskList;