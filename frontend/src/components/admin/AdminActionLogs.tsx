'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import adminService from '@/services/admin.service';
import toast from 'react-hot-toast';

export default function AdminActionLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await adminService.getActionLogs();
      setLogs(response.data);
    } catch (error) {
      toast.error('Failed to fetch action logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="space-y-4">
        {logs.map((log: any) => (
          <div
            key={log.id}
            className="flex items-start space-x-4 border-b border-gray-700 pb-4"
          >
            <div className="bg-gray-700 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-white">
                <span className="font-semibold">{log.adminName}</span>{' '}
                {log.action.toLowerCase()} {log.targetType}{' '}
                <span className="text-blue-400">{log.targetId}</span>
              </p>
              <p className="text-gray-400 text-sm">{log.reason}</p>
              <p className="text-gray-500 text-xs">
                {new Date(log.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}