import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllTasksForAdmin } from '../api';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function AdminTaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getTasks = async () => {
      try {
        setLoading(true);
        const fetchedTasks = await fetchAllTasksForAdmin();
        setTasks(fetchedTasks);
      } catch (err) {
        console.error("Error fetching all tasks:", err);
        setError('Failed to load tasks.');
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
        <h1 className="text-3xl font-bold">All Tasks</h1>
        <Link
          to="/admin/create-task"
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Task
        </Link>
      </div>

      <div className="bg-card border border-border rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-secondary/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Task Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Project</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Assigned To</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Due Date</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">View</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{task.fields['Task Name']}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{task.fields['Project Name'] || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{task.fields['Assigned To (Name)'] || 'Unassigned'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                     <span className={`px-2 py-1 text-xs rounded-full inline-block ${
                        task.fields.Status === 'Done' ? 'bg-green-500/20 text-green-300' :
                        task.fields.Status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-gray-500/20 text-gray-300'
                      }`}>
                        {task.fields.Status || 'To-Do'}
                      </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {task.fields['Due Date'] ? new Date(task.fields['Due Date']).toLocaleDateString() : 'Not set'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/admin/tasks/${task.id}`} className="text-primary hover:underline">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
       {tasks.length === 0 && (
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold">No tasks found.</h2>
            <p className="text-muted-foreground mt-2">There are no tasks in the system yet.</p>
          </div>
        )}
    </div>
  );
}
