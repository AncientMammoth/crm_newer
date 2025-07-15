import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchTasksByCreator } from '../api'; // We will use a similar API function
import { PlusIcon } from '@heroicons/react/24/outline';

export default function AdminMyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getTasks = async () => {
      try {
        setLoading(true);
        const userRecordId = localStorage.getItem('userRecordId');
        if (!userRecordId) {
          throw new Error("Admin user ID not found in local storage.");
        }
        const fetchedTasks = await fetchTasksByCreator(userRecordId);
        setTasks(fetchedTasks);
        setError('');
      } catch (err) {
        console.error("Error fetching admin's created tasks:", err);
        setError('Failed to load your created tasks.');
      } finally {
        setLoading(false);
      }
    };

    getTasks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="p-6 bg-background text-foreground">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Created Tasks</h1>
        <Link
          to="/admin/create-task"
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <PlusIcon className="-ml-0.5 h-5 w-5" />
                              Create Task
        </Link>
      </div>

      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <div key={task.id} className="bg-card p-5 rounded-lg shadow border border-border transition-transform hover:scale-105">
              <h2 className="text-xl font-semibold mb-2">{task.fields['Task Name']}</h2>
              <p className={`px-2 py-1 text-sm rounded-full inline-block mb-3 ${
                task.fields.Status === 'Done' ? 'bg-green-500/20 text-green-300' :
                task.fields.Status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-gray-500/20 text-gray-300'
              }`}>
                {task.fields.Status || 'To-Do'}
              </p>
              <p className="text-muted-foreground text-sm mb-4">
                Due Date: {task.fields['Due Date'] ? new Date(task.fields['Due Date']).toLocaleDateString() : 'Not set'}
              </p>
              <div className="flex justify-end">
                <Link to={`/admin/tasks/${task.id}`} className="text-primary hover:underline">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold">No tasks found.</h2>
          <p className="text-muted-foreground mt-2">You have not created any tasks yet.</p>
        </div>
      )}
    </div>
  );
}
