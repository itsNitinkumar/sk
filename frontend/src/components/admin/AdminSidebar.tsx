'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AdminSidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/courses', label: 'Courses' },
    { href: '/admin/categories', label: 'Categories' },
    { href: '/admin/analytics', label: 'Analytics' },
    { href: '/admin/moderation', label: 'Moderation' },
  ];

  return (
    <aside className="w-64 bg-gray-800 min-h-screen p-4">
      <h2 className="text-xl font-bold text-white mb-6">Admin Panel</h2>
      <nav>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block py-2 px-4 rounded mb-2 ${
              pathname === item.href
                ? 'bg-red-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;