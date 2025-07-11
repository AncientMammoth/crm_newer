import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Navbar from '../components/layout/Navbar'; 
import Footer from '../components/layout/Footer';
import { PlusCircleIcon } from '@heroicons/react/24/outline';


// Dummy API functions for fetching data - replace with your actual API calls
// You might want to move these to a dedicated `api.js` file
const fetchAdminData = async () => {
    const res = await fetch('/api/admin/all-data');
    if (!res.ok) throw new Error("Failed to fetch admin data");
    return res.json();
};

const fetchAllUsers = async () => {
    const res = await fetch('/api/users');
    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
};

const fetchAllProjects = async () => {
    const res = await fetch('/api/all-projects');
    if (!res.ok) throw new Error("Failed to fetch projects");
    return res.json();
};

const createTask = async (taskData) => {
    const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create task");
    }
    return res.json();
};


export default function AdminDashboard() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [allData, setAllData] = useState([]);
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");


    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const [adminData, usersData, projectsData] = await Promise.all([
                    fetchAdminData(),
                    fetchAllUsers(),
                    fetchAllProjects()
                ]);
                setAllData(adminData);
                setUsers(usersData);
                setProjects(projectsData);
                setError("");
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const onSubmitTask = async (data) => {
        try {
            setSuccessMessage("");
            setError("");
            const adminAirtableId = localStorage.getItem('userAirtableId');
            if (!adminAirtableId) {
                throw new Error("Admin user ID not found. Please log in again.");
            }

            const taskPayload = {
                "Task Name": data.taskName,
                "Description": data.description,
                "Project": [parseInt(data.projectId, 10)],
                "Assigned To": [data.assignedToAirtableId],
                "Due Date": data.dueDate,
                "Status": "Not Started",
                "Created By": [adminAirtableId]
            };
            
            await createTask(taskPayload);
            setSuccessMessage(`Task "${data.taskName}" created and assigned successfully!`);
            reset(); // Clear the form
        } catch (err) {
            setError(err.message);
        }
    };


    if (isLoading) {
        return <div className="text-center p-10">Loading Admin Dashboard...</div>;
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto p-8 bg-card text-foreground">
                <h1 className="text-4xl font-light mb-8 border-b border-border pb-4">Admin Dashboard</h1>

                {/* Create Task Form */}
                <div className="mb-12 p-6 bg-[#333333] rounded-lg border border-border">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center">
                        <PlusCircleIcon className="h-6 w-6 mr-2 text-primary" />
                        Create & Assign New Task
                    </h2>

                    {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
                    {error && <div className="text-red-500 mb-4">{error}</div>}

                    <form onSubmit={handleSubmit(onSubmitTask)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Task Name */}
                        <div className="col-span-2">
                            <label htmlFor="taskName" className="block mb-2 text-sm font-medium">Task Name</label>
                            <input {...register("taskName", { required: "Task name is required" })} id="taskName" className="input-class w-full" />
                            {errors.taskName && <span className="text-red-500 text-xs mt-1">{errors.taskName.message}</span>}
                        </div>
                        
                        {/* Description */}
                        <div className="col-span-2">
                            <label htmlFor="description" className="block mb-2 text-sm font-medium">Description</label>
                            <textarea {...register("description")} id="description" rows="3" className="input-class w-full"></textarea>
                        </div>

                        {/* Assign To User */}
                        <div>
                            <label htmlFor="assignedToAirtableId" className="block mb-2 text-sm font-medium">Assign To</label>
                            <select {...register("assignedToAirtableId", { required: "Please select a user" })} id="assignedToAirtableId" className="input-class w-full">
                                <option value="">Select a user...</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.airtable_id}>{user.user_name}</option>
                                ))}
                            </select>
                            {errors.assignedToAirtableId && <span className="text-red-500 text-xs mt-1">{errors.assignedToAirtableId.message}</span>}
                        </div>

                        {/* Assign to Project */}
                        <div>
                            <label htmlFor="projectId" className="block mb-2 text-sm font-medium">Link to Project</label>
                            <select {...register("projectId", { required: "Please select a project" })} id="projectId" className="input-class w-full">
                                <option value="">Select a project...</option>
                                {projects.map(project => (
                                    <option key={project.id} value={project.id}>{project.project_name}</option>
                                ))}
                            </select>
                            {errors.projectId && <span className="text-red-500 text-xs mt-1">{errors.projectId.message}</span>}
                        </div>

                        {/* Due Date */}
                        <div>
                            <label htmlFor="dueDate" className="block mb-2 text-sm font-medium">Due Date</label>
                            <input type="date" {...register("dueDate")} id="dueDate" className="input-class w-full" />
                        </div>

                        <div className="col-span-2 flex justify-end">
                            <button type="submit" className="btn-primary">Create Task</button>
                        </div>
                    </form>
                </div>


                {/* Users Data View */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">All Users Data</h2>
                    <div className="space-y-6">
                        {allData.map(user => (
                            <div key={user.user_id} className="p-4 bg-[#333333] rounded-lg border border-border">
                                <h3 className="text-xl font-bold text-primary">{user.user_name} <span className="text-sm font-normal text-muted-foreground">({user.email})</span></h3>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <h4 className="font-semibold mb-2">Accounts</h4>
                                        <ul className="list-disc list-inside text-sm">
                                            {user.accounts.length > 0 ? user.accounts.map(acc => <li key={acc.id}>{acc.account_name}</li>) : <li>No accounts</li>}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Projects</h4>
                                        <ul className="list-disc list-inside text-sm">
                                            {user.projects.length > 0 ? user.projects.map(proj => <li key={proj.id}>{proj.project_name}</li>) : <li>No projects</li>}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-2">Recent Updates</h4>
                                        <ul className="list-disc list-inside text-sm">
                                            {user.updates.length > 0 ? user.updates.slice(0, 5).map(upd => <li key={upd.id} title={upd.notes}>{upd.notes.substring(0, 40)}...</li>) : <li>No updates</li>}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
            <Footer />

            <style jsx>{`
                .input-class {
                    background-color: #444;
                    border: 1px solid #555;
                    color: #fff;
                    border-radius: 0.5rem;
                    padding: 0.75rem 1rem;
                }
                .btn-primary {
                    background-color: #007bff;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    font-weight: 500;
                    transition: background-color 0.2s;
                }
                .btn-primary:hover {
                    background-color: #0056b3;
                }
            `}</style>
        </>
    );
}