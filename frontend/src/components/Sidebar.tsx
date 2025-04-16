'use client';

import Link from 'next/link';
import { History, Settings, Clock, ThumbsUp, GraduationCap as Graduation, UserCheck, PlaySquare, Home } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: History, label: 'History', path: '/history' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: Clock, label: 'Watch Later', path: '/watch-later' },
    { icon: ThumbsUp, label: 'Liked', path: '/liked' },
    { icon: Graduation, label: 'Your Courses', path: '/my-courses' },
    { icon: UserCheck, label: 'Subscribed', path: '/subscribed' },
    { icon: PlaySquare, label: 'Playlists', path: '/playlists' },
  ];

  return (
    <div className="w-64 bg-gray-900 h-screen fixed left-0 top-16 text-white p-4">
      {menuItems.map((item) => (
        <Link
          key={item.label}
          href={item.path}
          className="flex items-center space-x-4 p-3 hover:bg-red-700 rounded-lg mb-2 transition-colors"
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;