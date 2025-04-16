'use client';

import { useState, useEffect } from 'react';
import { Users, BookOpen, Ban, History, AlertTriangle } from 'lucide-react';
import adminService from '@/services/admin.service';
import toast from 'react-hot-toast';
import AdminUsersList from '@/components/admin/AdminUsersList'; // Adjust the import path as needed 
import AdminCoursesList from '../../../components/admin/AdminCoursesList';
import AdminActionLogs from '@/components/admin/AdminActionLogs';
import AdminReports from '@/components/admin/AdminReports';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    activeUsers: 0,
    bannedUsers: 0,
    reportedContent: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const overview = await adminService.getPlatformOverview();
      setStats(overview.data);
    } catch (error: any) {
      toast.error('Failed to fetch admin stats');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <AdminUsersList />;
      case 'courses':
        return <AdminCoursesList />;
      case 'logs':
        return <AdminActionLogs />;
      case 'reports':
        return <AdminReports />;
      default:
        return renderOverview();
    }
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard
        icon={<Users className="w-8 h-8" />}
        title="Total Users"
        value={stats.totalUsers}
        color="blue"
      />
      <StatCard
        icon={<BookOpen className="w-8 h-8" />}
        title="Total Courses"
        value={stats.totalCourses}
        color="green"
      />
      <StatCard
        icon={<Ban className="w-8 h-8" />}
        title="Banned Users"
        value={stats.bannedUsers}
        color="red"
      />
      <StatCard
        icon={<AlertTriangle className="w-8 h-8" />}
        title="Reported Content"
        value={stats.reportedContent}
        color="yellow"
      />
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-8">
        <nav className="flex space-x-4">
          {[
            { id: 'overview', label: 'Overview', icon: Users },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'courses', label: 'Courses', icon: BookOpen },
            { id: 'logs', label: 'Action Logs', icon: History },
            { id: 'reports', label: 'Reports', icon: AlertTriangle },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center px-4 py-2 rounded-lg ${
                activeTab === id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Icon className="w-5 h-5 mr-2" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {renderContent()}
    </div>
  );
}

const StatCard = ({ icon, title, value, color }: any) => (
  <div className={`bg-gray-800 p-6 rounded-lg border-l-4 border-${color}-500`}>
    <div className="flex items-center">
      <div className={`text-${color}-500`}>{icon}</div>
      <div className="ml-4">
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <p className="text-2xl font-bold text-white">{value.toLocaleString()}</p>
      </div>
    </div>
  </div>
);


