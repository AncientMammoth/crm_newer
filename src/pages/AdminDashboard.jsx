import React, { useEffect, useState } from 'react';
import { getAdminDashboardData } from '../api';
import AdminNavbar from '../components/layout/AdminNavbar'; // Use the new AdminNavbar
import { toast } from "sonner";

const AdminDashboard = () => {
    const [data, setData] = useState({ users: [], projects: [], updates: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const adminData = await getAdminDashboardData();
                setData(adminData);
            } catch (error) {
                toast.error("Failed to load admin data.");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen flex-col bg-card">
                <AdminNavbar />
                <div className="flex flex-1 items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col bg-card text-foreground">
            <AdminNavbar />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                <h1 className="text-3xl font-bold text-foreground mb-6">System Overview</h1>

                {/* Users Section */}
                <section>
                    <h2 className="text-2xl font-semibold text-foreground mb-4">Users ({data.users.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {data.users.map(user => (
                            <div key={user.id} className="bg-secondary border border-border p-4 rounded-lg shadow-md transition-transform hover:scale-105">
                                <p className="font-bold text-lg">{user.user_name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <p className={`text-xs font-semibold uppercase mt-2 px-2 py-1 rounded-full inline-block ${user.user_type === 'admin' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>{user.user_type}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Projects Section - You can build this out further */}
                <section className="mt-8">
                     <h2 className="text-2xl font-semibold text-foreground mb-4">Projects ({data.projects.length})</h2>
                     <div className="bg-secondary border border-border p-4 rounded-lg">
                        <p className="text-muted-foreground">A list of all projects would be displayed here.</p>
                     </div>
                </section>

            </main>
        </div>
    );
};

export default AdminDashboard;
