import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const adminService = {
  // Platform Overview
  getPlatformOverview: () => axios.get(`${API_URL}/admin/overview`),

  // User Management
  getUsers: () => axios.get(`${API_URL}/admin/users`),
  banUser: (userId: string, reason: string) =>
    axios.post(`${API_URL}/admin/users/${userId}/ban`, { reason }),
  unbanUser: (userId: string) =>
    axios.post(`${API_URL}/admin/users/${userId}/unban`),

  // Course Management
  getCourses: () => axios.get(`${API_URL}/admin/courses`),
  dismissCourse: (courseId: string, reason: string) =>
    axios.post(`${API_URL}/admin/courses/${courseId}/dismiss`, { reason }),
  approveCourse: (courseId: string) =>
    axios.post(`${API_URL}/admin/courses/${courseId}/approve`),

  // Action Logs
  getActionLogs: () => axios.get(`${API_URL}/admin/logs`),

  // Reports
  getReports: () => axios.get(`${API_URL}/admin/reports`),
  resolveReport: (reportId: string, resolution: string) =>
    axios.post(`${API_URL}/admin/reports/${reportId}/resolve`, { resolution }),
};

export default adminService;
