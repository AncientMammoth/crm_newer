import React, { useState, useEffect, useCallback } from 'react';
import { fetchAllProjectsForAdmin } from '../api';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDebounce } from '../hooks/useDebounce'; // Assuming you have a debounce hook

export default function AdminProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const debouncedSearch = useDebounce(filters.search, 300);

  const loadProjects = useCallback(async () => {
      try {
        setLoading(true);
        const params = {
            search: debouncedSearch,
            status: filters.status
        };
        const fetchedProjects = await fetchAllProjectsForAdmin(params);
        setProjects(fetchedProjects);
        setError(null);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Could not load project data.");
      } finally {
        setLoading(false);
      }
  }, [debouncedSearch, filters.status]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="px-4 sm:px-0">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A list of all projects across all accounts in the system.
          </p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="sm:col-span-2">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                </div>
                <input
                    type="search"
                    name="search"
                    id="search"
                    className="block w-full rounded-md border-border bg-secondary py-2 pl-10 pr-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                    placeholder="Search by project name..."
                    onChange={handleFilterChange}
                    value={filters.search}
                />
            </div>
        </div>
        <div>
            <label htmlFor="status" className="sr-only">Status</label>
            <select
                id="status"
                name="status"
                className="block w-full rounded-md border-border bg-secondary py-2 pl-3 pr-10 text-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
                onChange={handleFilterChange}
                value={filters.status}
            >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
                <option value="Cancelled">Cancelled</option>
            </select>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-border ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-secondary/50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-foreground sm:pl-6">Project Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Account</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Owner</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {loading ? (
                    <tr>
                        <td colSpan="5" className="py-8 text-center">
                            <div className="flex justify-center items-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        </td>
                    </tr>
                  ) : error ? (
                    <tr>
                        <td colSpan="5" className="py-8 text-center text-red-500">{error}</td>
                    </tr>
                  ) : projects.length > 0 ? (
                    projects.map((project) => (
                        <tr key={project.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-foreground sm:pl-6">{project.fields['Project Name']}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{project.fields['Account Name (from Account)'] || 'N/A'}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{project.fields['Project Owner Name'] || 'N/A'}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{project.fields['Project Status']}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">₹{(project.fields['Project Value'] || 0).toLocaleString()}</td>
                        </tr>
                    ))
                  ) : (
                    <tr>
                        <td colSpan="5" className="py-8 text-center text-muted-foreground">No projects found.</td>
                    </tr>
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
