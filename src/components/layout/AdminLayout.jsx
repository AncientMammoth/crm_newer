import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

export default function AdminLayout() {
  return (
    // Changed to bg-background for proper theme contrast, as seen in reference images
    <div className="min-h-screen bg-background text-foreground font-sans">
      <AdminNavbar />
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
