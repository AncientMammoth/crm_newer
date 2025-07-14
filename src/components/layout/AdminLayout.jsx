import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

/**
 * A consistent layout for all admin pages.
 * It includes the AdminNavbar and a main content area for the specific page.
 */
export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-card text-foreground font-sans">
      <AdminNavbar />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
