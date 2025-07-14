import React, { useState, useEffect } from 'react';
import { fetchAllUpdatesForAdmin } from '../api'; // This function will be created next

export default function AdminUpdateList() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUpdates = async () => {
      try {
        setLoading(true);
        const fetchedUpdates = await fetchAllUpdatesForAdmin();
        setUpdates(fetchedUpdates);
        setError(null);
      } catch (err) {
        console.error("Error fetching updates:", err);
        setError("Could not load update data.");
      } finally {
        setLoading(false);
      }
    };
    loadUpdates();
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
          <h1 className="text-2xl font-bold text-foreground">Updates</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A chronological list of all updates posted in the system.
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
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-foreground sm:pl-6">Date</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Notes</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Project</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-foreground">Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {updates.map((update) => (
                    <tr key={update.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-muted-foreground sm:pl-6">{new Date(update.fields['Date']).toLocaleDateString()}</td>
                      <td className="py-4 px-3 text-sm text-foreground">{update.fields['Notes']}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{update.fields['Project Name']}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-muted-foreground">{update.fields['Update Owner Name']}</td>
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
