import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShieldCheckIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

/**
 * Navigation bar for the admin section.
 * Provides links to different admin pages and a way to return to the main site.
 */
export default function AdminNavbar() {
  const activeLinkClass = "bg-secondary text-foreground";
  const inactiveLinkClass = "text-muted-foreground hover:bg-secondary/80 hover:text-foreground";

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/admin/dashboard" className="flex-shrink-0 flex items-center gap-2">
              <ShieldCheckIcon className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold text-foreground">Admin Panel</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink
                  to="/admin/dashboard"
                  className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                >
                  Users
                </NavLink>
                <NavLink
                  to="/admin/projects"
                  className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                >
                  Projects
                </NavLink>
                 <NavLink
                  to="/admin/tasks"
                  className={({ isActive }) => `${isActive ? activeLinkClass : inactiveLinkClass} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                >
                  Tasks
                </NavLink>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <Link
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              <span>Back to Site</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
