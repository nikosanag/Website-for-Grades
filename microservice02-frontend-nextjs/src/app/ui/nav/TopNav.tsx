'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';

export default function TopNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const token = localStorage.getItem('token');
    if (token) {
      await fetch('http://localhost:3001/api/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
    }
    localStorage.removeItem('logged_in');
    localStorage.removeItem('token');
    sessionStorage.clear();
    localStorage.clear();
    router.replace('/');
  }

  return (
    <header className="bg-gradient-to-r from-blue-50 to-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 w-full">
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="text-xl font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200">
              <span className="inline-flex items-center">
                clearSKY
              </span>
            </Link>
          </div>

          <div className="flex-shrink-0">
            {pathname !== '/' && (
              <button
                onClick={handleLogout}
                className={clsx(
                  'inline-flex items-center px-4 py-2 rounded-lg',
                  'text-sm font-medium text-blue-600',
                  'transition-all duration-200 ease-in-out',
                  'hover:bg-blue-50 hover:text-blue-700',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  pathname === '/' && 'bg-blue-100'
                )}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
