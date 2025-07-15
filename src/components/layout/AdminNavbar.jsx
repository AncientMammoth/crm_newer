import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Navigation links for the admin panel. "Tasks" is handled separately as a dropdown.
const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Users', href: '/admin/users' },
  { name: 'Accounts', href: '/admin/accounts' },
  { name: 'Projects', href: '/admin/projects' },
  { name: 'Updates', href: '/admin/updates' },
];

// Task-related links for the dropdown
const taskNavigation = [
    { name: 'All Tasks', href: '/admin/tasks' },
    { name: 'My Created Tasks', href: '/admin/my-tasks' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

// A custom SVG logo component for "Rian"
const RianLogo = () => (
    <svg width="60" height="24" viewBox="0 0 80 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
        <path d="M10.88 23.5V0.5H18.92C21.16 0.5 22.9933 1.13333 24.42 2.4C25.8467 3.66667 26.56 5.26667 26.56 7.2C26.56 8.54667 26.16 9.7 25.36 10.66C24.56 11.62 23.5133 12.2667 22.22 12.6L27.24 23.5H20.6L16.24 13.52H15.12V23.5H10.88ZM15.12 10.16H18.44C19.4267 10.16 20.1867 9.89333 20.72 9.36C21.2533 8.82667 21.52 8.12 21.52 7.24C21.52 6.36 21.2533 5.66667 20.72 5.16C20.1867 4.65333 19.4267 4.4 18.44 4.4H15.12V10.16Z" fill="currentColor"/>
        <path d="M32.0911 23.5V0.5H36.3311V23.5H32.0911Z" fill="currentColor"/>
        <path d="M41.0331 23.5V0.5H53.5931V4.4H45.2731V10.04H52.7931V13.94H45.2731V19.6H53.9931V23.5H41.0331Z" fill="currentColor"/>
        <path d="M58.3313 23.5V0.5H62.5713L70.4913 15.2V0.5H74.3313V23.5H70.0913L62.1713 8.8V23.5H58.3313Z" fill="currentColor"/>
    </svg>
);

/**
 * Generates user initials from a name string.
 * - "John Doe" -> "JD"
 * - "Ryan" -> "R"
 * - "" or null -> "A" (for Admin)
 */
const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'A';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  if (parts.length > 1) {
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }
  return 'A'; // Fallback for empty strings or other edge cases
};


export default function AdminNavbar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Admin';
  const userInitials = getInitials(userName);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Disclosure as="nav" className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/admin/dashboard" className="hover:opacity-80 transition-opacity">
                    <RianLogo />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8 relative">
                  {/* Render standard navigation links */}
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className="relative inline-flex items-center px-1 pt-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {({ isActive }) => (
                        <>
                          <span>{item.name}</span>
                          {isActive && (
                            <motion.div
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                              layoutId="admin-underline"
                              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            />
                          )}
                        </>
                      )}
                    </NavLink>
                  ))}

                  {/* --- Tasks Dropdown Menu --- */}
                  <Menu as="div" className="relative inline-flex items-center">
                    <Menu.Button className="inline-flex items-center px-1 pt-1 text-sm font-medium text-muted-foreground hover:text-foreground group transition-colors">
                      <span>Tasks</span>
                      <ChevronDownIcon className="ml-1 h-4 w-4 text-muted-foreground group-hover:text-foreground" aria-hidden="true" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-secondary py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none top-full">
                        {taskNavigation.map((item) => (
                             <Menu.Item key={item.name}>
                                {({ active }) => (
                                    <NavLink
                                    to={item.href}
                                    className={({ isActive }) => classNames(
                                        active || isActive ? 'bg-card text-foreground' : 'text-muted-foreground',
                                        'block px-4 py-2 text-sm'
                                    )}
                                    >
                                    {item.name}
                                    </NavLink>
                                )}
                            </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-secondary">
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                        {userInitials}
                      </div>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-secondary py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={classNames(
                              active ? 'bg-card' : '',
                              'block w-full text-left px-4 py-2 text-sm text-muted-foreground'
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile view */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {[...navigation, ...taskNavigation].map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={NavLink}
                  to={item.href}
                  className={({ isActive }) => classNames(
                    isActive ? 'border-primary bg-primary/10 text-primary' : 'border-transparent text-muted-foreground hover:border-gray-300 hover:bg-secondary hover:text-foreground',
                    'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
                  )}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
            <div className="border-t border-border pt-4 pb-3">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                     {userInitials}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-foreground">{userName}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Disclosure.Button
                  as="button"
                  onClick={handleLogout}
                  className="block w-full text-left rounded-md px-4 py-2 text-base font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  Sign out
                </Disclosure.Button>
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
