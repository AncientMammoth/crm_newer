import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllTasksForAdmin, fetchAllUsersForAdmin, fetchAllProjectsForAdmin } from '../api';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function AdminTaskList() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ status: '', assignedToId: '', projectId: '' });
  const navigate = useNavigate();

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      // Pass filters to the backend API call
      const fetchedTasks = await fetchAllTasksForAdmin(filters);
      setTasks(fetchedTasks);
      setError(null);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Could not load task data.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const loadFilterData = async () => {
        try {
            const [fetchedUsers, fetchedProjects] = await Promise.all([
                fetchAllUsersForAdmin(),
                fetchAllProjectsForAdmin()
            ]);
            setUsers(fetchedUsers);
            setProjects(fetchedProjects);
        } catch (err) {
            console.error("Failed to load filter data", err);
        }
    };
    loadFilterData();
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', assignedToId: '', projectId: '' });
  };

  return (
    <div className="px-4 sm:px-0">
        <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:flex-auto">
                <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
                <p className="mt-2 text-sm text-muted-foreground">A list of all tasks across all projects in the system.</p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <button
                    type="button"
                    onClick={() => navigate('/admin/create-task')}
                    className="inline-flex items-center gap-x-2 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                    <PlusIcon className="-ml-0.5 h-5 w-5" />
                    Create Task
                </button>
            </div>
        </div>
        
        <div className="mt-6 p-4 bg-[#333333] border border-border rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                    <select name="status" id="status" onChange={handleFilterChange} value={filters.status} className="block w-full rounded-md border-input bg-secondary py-2 pl-3 pr-10 text-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm">
                        <option value="">All</option>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="assignedToId" className="block text-sm font-medium text-muted-foreground mb-1">Assigned To</label>
                    <select name="assignedToId" id="assignedToId" onChange={handleFilterChange} value={filters.assignedToId} className="block w-full rounded-md border-input bg-secondary py-2 pl-3 pr-10 text-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm">
                        <option value="">All Users</option>
                        {users.map(user => <option key={user.id} value={user.id}>{user.fields['User Name']}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="projectId" className="block text-sm font-medium text-muted-foreground mb-1">Project</label>
                    <select name="projectId" id="projectId" onChange={handleFilterChange} value={filters.projectId} className="block w-full rounded-md border-input bg-secondary py-2 pl-3 pr-10 text-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm">
                        <option value="">All Projects</option>
                        {projects.map(project => <option key={project.id} value={project.id}>{project.fields['Project Name']}</option>)}
                    </select>
                </div>
                <div className="flex items-end">
                    <button onClick={clearFilters} className="text-sm text-muted-foreground hover:text-accent flex items-center gap-1 transition-colors">
                        <XMarkIcon className="h-4 w-4" />
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>

        <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-border ring-opacity-5 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-[#333333]">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-foreground sm:pl-6">Task Name</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Project</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Assigned To</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Status</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Due Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border bg-[#333333]">
                                {loading ? (
                                    <tr><td colSpan="5" className="py-8 text-center"><div className="flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div></div></td></tr>
                                ) : error ? (
                                    <tr><td colSpan="5" className="py-8 text-center text-red-500">{error}</td></tr>
                                ) : tasks.length > 0 ? (
                                    tasks.map((task) => (
                                        <tr key={task.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-foreground sm:pl-6">{task.fields['Task Name']}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{task.fields['Project Name']}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{task.fields['Assigned To Name']}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{task.fields['Status']}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{task.fields['Due Date']}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" className="py-8 text-center text-muted-foreground">No tasks found for the selected filters.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}