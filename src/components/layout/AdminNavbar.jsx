import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeftOnRectangleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem("userName") || "Admin";

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-40 flex h-16 w-full flex-shrink-0 items-center justify-between bg-card px-4 shadow-md sm:px-6 lg:px-8 border-b border-border">
            <div className="flex items-center space-x-4">
                <Link to="/admin" className="flex items-center space-x-2">
                    <img
                        className="h-8 w-auto"
                        src="/rian-logo-footer.svg"
                        alt="Rian Logo"
                    />
                </Link>
                <div className="h-6 w-px bg-border" />
                <div className="flex items-center space-x-2">
                    <ShieldCheckIcon className="h-6 w-6 text-primary" />
                    <h1 className="text-lg font-semibold text-foreground">Admin Dashboard</h1>
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">Welcome, {userName}</span>
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 rounded-md bg-secondary px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
                >
                    <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
};

export default AdminNavbar;
