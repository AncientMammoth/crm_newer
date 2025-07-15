import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ShieldCheckIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

// Utility function for conditional class names
const cn = (...inputs) => inputs.filter(Boolean).join(' ');

export default function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add your logout logic here, e.g., clearing tokens, user data
    console.log("User logged out");
    navigate('/login'); // Redirect to login page after logout
  };

  const activeLinkClass = "bg-secondary text-foreground";
  const inactiveLinkClass = "text-muted-foreground hover:bg-secondary/80 hover:text-foreground";

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard' },
    { name: 'Users', href: '/admin/users' },
    { name: 'Accounts', href: '/admin/accounts' },
    { name: 'Projects', href: '/admin/projects' },
    { name: 'Tasks', href: '/admin/tasks' },
    { name: 'Updates', href: '/admin/updates' },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full flex-shrink-0 items-center bg-card shadow-md">
      <div className="flex flex-1 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Navigation Links */}
        <div className="flex items-center space-x-8">
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <ShieldCheckIcon className="h-8 w-8 text-primary" />
            <span className="text-xl font-semibold text-foreground hidden sm:inline">Admin Panel</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150',
                    isActive ? activeLinkClass : inactiveLinkClass
                  )
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors duration-150"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
