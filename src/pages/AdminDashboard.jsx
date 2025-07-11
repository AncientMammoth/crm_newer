import React, { useEffect, useState } from 'react';
import { getAdminDashboardData } from '../api';
import Navbar from '../components/layout/Navbar';
import { toast } from "sonner"; // This will work after you run 'npm install sonner'

const AdminDashboard = () => {
    const [data, setData] = useState({ users: [], projects: [], updates: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const adminData = await getAdminDashboardData();
                setData(adminData);
            } catch (error) {
                toast.error("Failed to load admin data. Please check your connection.");
                console.error("Admin Dashboard Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-card">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-card text-foreground">
            <Navbar />
            <main className="container mx-auto p-4 md:p-8 mt-16 md:mt-0">
                <h1 className="text-3xl font-bold text-foreground mb-6">Admin Dashboard</h1>

                {/* Users Section */}
                <section>
                    <h2 className="text-2xl font-semibold text-foreground mb-4">Users ({data.users.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {data.users.map(user => (
                            <div key={user.id} className="bg-secondary border border-border p-4 rounded-lg shadow-md">
                                <p className="font-bold text-lg">{user.user_name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <p className={`text-xs font-semibold uppercase mt-2 px-2 py-1 rounded-full inline-block ${user.user_type === 'admin' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>{user.user_type}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* You can add more sections here for Projects and Updates */}
                <section className="mt-8">
                     <h2 className="text-2xl font-semibold text-foreground mb-4">Projects ({data.projects.length})</h2>
                     <div className="bg-secondary border border-border p-4 rounded-lg">
                        <p className="text-muted-foreground">Project data would be displayed here.</p>
                     </div>
                </section>

            </main>
        </div>
    );
};

export default AdminDashboard;
