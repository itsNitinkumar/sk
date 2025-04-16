'use client';

import Link from 'next/link';
import { Users } from 'lucide-react';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function Subscriptions() {
  const subscriptions = [
    {
      id: '1',
      name: 'Tanvi Modi',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      subscribers: 15420,
      coursesCount: 12,
      lastCourse: 'Advanced React Patterns'
    },
    {
      id: '2',
      name: 'Jadam',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      subscribers: 12350,
      coursesCount: 8,
      lastCourse: 'Python for Data Science'
    }
  ];

  return (
    <ProtectedRoute>

      <div className="ml-64 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <Users className="w-6 h-6 text-red-600 mr-2" />
            <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
          </div>

          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <Link
                key={subscription.id}
                href={`/instructor/${subscription.id}`}
                className="block bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={subscription.avatar}
                    alt={subscription.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{subscription.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {subscription.subscribers.toLocaleString()} subscribers • {subscription.coursesCount} courses
                    </p>
                    <p className="text-gray-500 text-sm">
                      Latest: {subscription.lastCourse}
                    </p>
                  </div>
                  <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                    Subscribed
                  </button>
                </div>
              </Link>
            ))}
          </div>

          {subscriptions.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">No subscriptions yet</h2>
              <p className="text-gray-400">
                Subscribe to your favorite instructors to see their latest courses here!
              </p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}