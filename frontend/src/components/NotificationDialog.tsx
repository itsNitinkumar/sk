import React from 'react';
import { Bell, X } from 'lucide-react';

interface NotificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationDialog: React.FC<NotificationDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      type: 'course_update',
      title: 'New lecture available',
      message: 'A new lecture has been added to "Advanced React Patterns"',
      time: '2 hours ago'
    },
    {
      id: '2',
      type: 'instructor_post',
      title: 'Jane Smith posted an announcement',
      message: 'Important updates about the upcoming live session',
      time: '1 day ago'
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Achievement unlocked',
      message: 'You completed your first course! Keep learning!',
      time: '2 days ago'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-gray-800 rounded-lg shadow-xl mt-20 w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center">
            <Bell className="w-5 h-5 text-red-600 mr-2" />
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="p-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer"
            >
              <h3 className="text-white font-medium mb-1">{notification.title}</h3>
              <p className="text-gray-400 text-sm mb-2">{notification.message}</p>
              <span className="text-xs text-gray-500">{notification.time}</span>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-700">
          <button className="w-full text-center text-red-600 hover:text-red-500">
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDialog;