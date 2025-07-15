import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchTaskById } from '../api';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function AdminTaskDetail() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const getTaskDetails = async () => {
      try {
        setLoading(true);
        const fetchedTask = await fetchTaskById(taskId);
        if (!fetchedTask) {
          throw new Error('Task not found.');
        }
        setTask(fetchedTask);
      } catch (err) {
        console.error('Error fetching task details:', err);
        setError('Failed to load task details.');
      } finally {
        setLoading(false);
      }
    };

    getTaskDetails();
  }, [taskId]);

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

  if (!task) {
    return <div className="text-center p-4">Task not found.</div>;
  }

  const { fields } = task;
  const assignedTo = fields['Assigned To (Name)'] ? fields['Assigned To (Name)'][0] : 'Unassigned';
  const createdBy = fields['Created By (Name)'] ? fields['Created By (Name)'][0] : 'Unknown';

  return (
    <div className="p-6 bg-background text-foreground">
      <div className="mb-6">
        <Link
          to="/admin/tasks"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to All Tasks
        </Link>
      </div>

      <div className="bg-card p-8 rounded-lg shadow-lg border border-border">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-4xl font-bold text-foreground">{fields['Task Name']}</h1>
          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
            fields.Status === 'Done' ? 'bg-green-500/20 text-green-300' :
            fields.Status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-300' :
            'bg-gray-500/20 text-gray-300'
          }`}>
            {fields.Status || 'To-Do'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-muted-foreground mb-6">
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">Assigned To</span>
            <span>{assignedTo}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">Created By</span>
            <span>{createdBy}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">Due Date</span>
            <span>{fields['Due Date'] ? new Date(fields['Due Date']).toLocaleDateString() : 'Not set'}</span>
          </div>
        </div>

        {fields.Description && (
          <div>
            <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2 mb-4">Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">{fields.Description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
