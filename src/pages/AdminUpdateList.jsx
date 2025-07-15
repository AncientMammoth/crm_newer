import React, { useState, useEffect, useCallback } from 'react';
import { fetchAllUpdatesForAdmin, fetchAllUsersForAdmin, fetchAllProjectsForAdmin } from '../api';

export default function AdminUpdateList() {
  const [updates, setUpdates] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ ownerId: '', projectId: '', startDate: '', endDate: '' });

  const loadUpdates = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedUpdates = await fetchAllUpdatesForAdmin(filters);
      setUpdates(fetchedUpdates);
      setError(null);
    } catch (err) {
      console.error("Error fetching updates:", err);
      setError("Could not load update data.");
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
    loadUpdates();
  }, [loadUpdates]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="px-4 sm:px-0">
        <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
                <h1 className="text-2xl font-bold text-foreground">Updates</h1>
                <p className="mt-2 text-sm text-muted-foreground">A chronological list of all updates posted in the system.</p>
            </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input type="date" name="startDate" onChange={handleFilterChange} value={filters.startDate} className="block w-full rounded-md border-border bg-secondary py-2 px-3 text-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"/>
            <input type="date" name="endDate" onChange={handleFilterChange} value={filters.endDate} className="block w-full rounded-md border-border bg-secondary py-2 px-3 text-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"/>
            <select name="ownerId" onChange={handleFilterChange} value={filters.ownerId} className="block w-full rounded-md border-border bg-secondary py-2 pl-3 pr-10 text-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm">
                <option value="">All Owners</option>
                {users.map(user => <option key={user.id} value={user.id}>{user.fields['User Name']}</option>)}
            </select>
            <select name="projectId" onChange={handleFilterChange} value={filters.projectId} className="block w-full rounded-md border-border bg-secondary py-2 pl-3 pr-10 text-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm">
                <option value="">All Projects</option>
                {projects.map(project => <option key={project.id} value={project.id}>{project.fields['Project Name']}</option>)}
            </select>
        </div>

        <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-border ring-opacity-5 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-border">
                            <thead className="bg-secondary/50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-foreground sm:pl-6">Date</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Notes</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Project</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Owner</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border bg-card">
                                {loading ? (
                                    <tr><td colSpan="4" className="py-8 text-center"><div className="flex justify-center items-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div></td></tr>
                                ) : error ? (
                                    <tr><td colSpan="4" className="py-8 text-center text-red-500">{error}</td></tr>
                                ) : updates.length > 0 ? (
                                    updates.map((update) => (
                                        <tr key={update.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-muted-foreground sm:pl-6">{new Date(update.fields['Date']).toLocaleDateString()}</td>
                                            <td className="py-4 px-3 text-sm text-foreground">{update.fields['Notes']}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{update.fields['Project Name']}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{update.fields['Update Owner Name']}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" className="py-8 text-center text-muted-foreground">No updates found for the selected filters.</td></tr>
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
