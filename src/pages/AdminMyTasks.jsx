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
    <div className="px-4 sm:px-0">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div className="sm:flex-auto">
            <h1 className="text-2xl font-bold text-foreground">My Created Tasks</h1>
            <p className="mt-2 text-sm text-muted-foreground">A list of all tasks you have created and assigned.</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="/admin/create-task"
              className="inline-flex items-center gap-x-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <PlusIcon className="-ml-0.5 h-5 w-5" />
              Create Task
            </Link>
        </div>
      </div>

      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <div key={task.id} className="bg-[#333333] p-5 rounded-lg shadow border border-border transition-transform hover:scale-105">
              <h2 className="text-xl font-semibold mb-2 text-foreground">{task.fields['Task Name']}</h2>
              <p className={`px-2 py-1 text-sm rounded-full inline-block mb-3 ${
                task.fields.Status === 'Done' ? 'bg-green-500/20 text-green-300' :
                task.fields.Status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-gray-500/20 text-gray-300'
              }`}>
                {task.fields.Status || 'To-Do'}
              </p>
              <div className="text-muted-foreground text-sm mb-4">
                <p>Assigned To: <span className="font-medium text-foreground/90">{task.fields['Assigned To Name']}</span></p>
                <p>Due Date: <span className="font-medium text-foreground/90">{task.fields['Due Date'] ? new Date(task.fields['Due Date']).toLocaleDateString() : 'Not set'}</span></p>
              </div>
              <div className="flex justify-end mt-4">
                <Link to={`/admin/tasks/${task.id}`} className="text-sm font-semibold text-primary hover:text-primary/90">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4 bg-[#333333] rounded-lg border border-border">
          <h2 className="text-xl font-semibold text-foreground">No tasks found.</h2>
          <p className="text-muted-foreground mt-2">You have not created any tasks yet. Get started by creating one.</p>
        </div>
      )}
    </div>
  );
}