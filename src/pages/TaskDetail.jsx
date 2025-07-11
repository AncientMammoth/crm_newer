import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTaskById, fetchUpdatesByIds } from "../api";
import React from "react";
import { motion } from "framer-motion";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

export default function TaskDetail() {
  const { id } = useParams();

  const { data: task, isLoading, error } = useQuery({
    queryKey: ["task", id],
    queryFn: () => fetchTaskById(id),
    enabled: !!id,
  });

  const updateIds = task?.fields?.Updates || [];
  const { data: updates, isLoading: updatesLoading } = useQuery({
    queryKey: ["taskUpdates", updateIds],
    queryFn: () => fetchUpdatesByIds(updateIds),
    enabled: updateIds.length > 0,
  });

  if (isLoading) return <div className="text-center py-20 text-lg text-muted-foreground">Loading task details...</div>;
  if (error) return <div className="text-red-500 text-center py-10">Error loading task: {error.message}</div>;
  if (!task) return <div className="text-center py-10 text-muted-foreground">No task data found.</div>;

  const name = task.fields["Task Name"] || "Unnamed Task";
  const description = task.fields["Description"] || <span className="italic">No description provided.</span>;
  const status = task.fields["Status"] || "N/A";
  const dueDate = task.fields["Due Date"] ? new Date(task.fields["Due Date"]).toLocaleDateString() : "N/A";
  const projectName = task.fields["Project Name"]?.[0] || "N/A";
  const projectId = task.fields["Project"]?.[0];
  const assignedToName = task.fields["Assigned To Name"]?.[0] || "N/A";

  const statusColors = {
    "To Do": "bg-gray-500/10 text-gray-400 border-gray-500/20",
    "In Progress": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Done": "bg-green-500/10 text-green-400 border-green-500/20",
    "Blocked": "bg-red-500/10 text-red-400 border-red-500/20",
  };
  const statusColor = statusColors[status] || "bg-secondary text-muted-foreground border-border";


  return (
    <div className="min-h-screen bg-card w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <nav className="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
                    <ol className="list-none p-0 inline-flex items-center">
                    <li className="flex items-center">
                        <Link to="/tasks" className="hover:text-accent transition-colors">Tasks</Link>
                        <ChevronRightIcon className="h-5 w-5 text-muted-foreground mx-1" />
                    </li>
                    <li>
                        <span className="font-semibold text-foreground">{name}</span>
                    </li>
                    </ol>
                </nav>

                <div className="bg-[#333333] p-6 sm:p-8 rounded-2xl border border-border mb-10">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-3xl font-light text-foreground">{name}</h1>
                        <span className={`text-xs font-medium px-3 py-1 rounded-full border ${statusColor}`}>{status}</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm text-muted-foreground font-light">
                        <p><strong>Due Date:</strong> {dueDate}</p>
                        <p><strong>Assigned To:</strong> {assignedToName}</p>
                        <p>
                            <strong>Project:</strong>{" "}
                            {projectId ? (
                                <Link to={`/projects/${projectId}`} className="font-medium text-accent hover:underline">
                                    {projectName}
                                </Link>
                            ) : (
                                projectName
                            )}
                        </p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-border">
                        <h3 className="text-base font-semibold text-foreground mb-2">Description</h3>
                        <p className="text-foreground font-light">{description}</p>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-light text-foreground mb-4">Associated Updates</h2>
                    <div className="space-y-4">
                    {updatesLoading ? (
                        <p className="text-muted-foreground font-light">Loading updates...</p>
                    ) : updates && updates.length > 0 ? (
                        updates.map((update) => (
                        <div key={update.id} className="bg-secondary p-4 rounded-lg border border-border">
                            <p className="text-foreground whitespace-pre-wrap mb-3 font-light">{update.fields.Notes}</p>
                            <div className="flex justify-between items-center text-xs text-muted-foreground pt-3 border-t border-border">
                            <span><strong>Date:</strong> {new Date(update.fields.Date).toLocaleDateString()}</span>
                            <span><strong>Owner:</strong> {update.fields["Update Owner Name"]?.[0]}</span>
                            </div>
                        </div>
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground bg-secondary p-6 rounded-lg border border-border italic font-light">No updates are associated with this task.</div>
                    )}
                    </div>
                </div>
            </motion.div>
        </div>
    </div>
  );
}
