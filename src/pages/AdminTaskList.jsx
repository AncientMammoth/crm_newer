import React, { useState, useEffect } from 'react';
import { fetchAllTasksForAdmin } from '../api';

export default function AdminTaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const fetchedTasks = await fetchAllTasksForAdmin();
        setTasks(fetchedTasks);
        setError(null);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Could not load task data.");
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
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
          <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A list of all tasks across all projects in the system.
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
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-foreground sm:pl-6">Task Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Project</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Assigned To</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-foreground sm:pl-6">{task.fields['Task Name']}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{task.fields['Project Name']}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{task.fields['Assigned To Name']}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{task.fields['Status']}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{task.fields['Due Date']}</td>
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
