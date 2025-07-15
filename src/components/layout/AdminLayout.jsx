import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar'; // We will now use the specific AdminNavbar
import Footer from './Footer';

/**
 * A simplified layout for the admin section.
 * It removes the sidebar and uses the AdminNavbar for all navigation,
 * then renders the current page's content via the Outlet.
 */
export default function AdminLayout() {
  return (
    <>
      {/* The AdminNavbar now handles all navigation links */}
      <AdminNavbar />
      
      {/* The main content area where child routes will be rendered */}
      <div className="min-h-[80vh] bg-card">
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>

      <Footer />
    </>
  );
}
