'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  { label: 'View Grade Statistics', href: '/dashboard/student/stats' },
  { label: 'My Courses', href: '/dashboard/student/courses' },
  { label: 'View Personal Grades', href: '/dashboard/student/grades' },
  { label: 'Grade Review Request', href: '/dashboard/student/review-request' },
  { label: 'Status of Grade Review Requests', href: '/dashboard/student/review-status' },
];

export default function StudentNav() {
  const pathname = usePathname();

  return (
    <div className="text-sm space-y-4">
      <div className="text-gray-500 uppercase font-semibold text-xs tracking-wide px-1">
        Student
      </div>
      <ul className="space-y-1">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={clsx(
                'block px-3 py-2 rounded-md',
                pathname === item.href
                  ? 'bg-blue-100 text-blue-800 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
