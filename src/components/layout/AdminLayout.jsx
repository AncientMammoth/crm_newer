import { Disclosure } from '@headlessui/react';
import {
  UsersIcon,
  FolderIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  BuildingOfficeIcon,
  NewspaperIcon,
  PencilSquareIcon // New Icon for "My Created Tasks"
} from '@heroicons/react/24/outline';
import { NavLink, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const adminNavigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: ChartBarIcon },
  { name: 'Users', href: '/admin/users', icon: UsersIcon },
  { name: 'Accounts', href: '/admin/accounts', icon: BuildingOfficeIcon },
  { name: 'Projects', href: '/admin/projects', icon: FolderIcon },
  { name: 'All Tasks', href: '/admin/tasks', icon: ClipboardDocumentListIcon },
  // --- New Link Added ---
  { name: 'My Created Tasks', href: '/admin/my-tasks', icon: PencilSquareIcon },
  { name: 'Updates', href: '/admin/updates', icon: NewspaperIcon },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminLayout() {
  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] bg-background">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-card p-4 border-r border-border hidden md:block">
            <div className="flex flex-col space-y-2">
              <p className="px-4 pt-2 pb-2 text-xs font-semibold text-muted-foreground uppercase">Menu</p>
              {adminNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    classNames(
                      'flex items-center px-4 py-2 text-sm font-medium rounded-md',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-secondary'
                    )
                  }
                >
                  <item.icon className="mr-3 h-6 w-6" aria-hidden="true" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}