'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const navItems = [
  { label: 'Post Initial Grades', href: '/dashboard/instructor/post-initial' },
  { label: 'Post Final Grades', href: '/dashboard/instructor/post-final' },
  { label: 'Review Requests', href: '/dashboard/instructor/review-requests' },
  { label: 'Reply to Review Requests', href: '/dashboard/instructor/reply-reviews' },
  { label: 'View Grade Statistics', href: '/dashboard/instructor/stats' },
];

export default function InstructorNav() {
  const pathname = usePathname();

  return (
    <div className="text-sm space-y-4">
      <div className="text-gray-500 uppercase font-semibold text-xs tracking-wide px-1">
        Instructor
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
