'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Check, Search } from 'lucide-react';
import adminService from '@/services/admin.service';
import toast from 'react-hot-toast';

export default function AdminCoursesList() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await adminService.getCourses();
      setCourses(response.data);
    } catch (error) {
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const handleDismissCourse = async (courseId: string, reason: string) => {
    try {
      await adminService.dismissCourse(courseId, reason);
      toast.success('Course dismissed successfully');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to dismiss course');
    }
  };

  const handleApproveCourse = async (courseId: string) => {
    try {
      await adminService.approveCourse(courseId);
      toast.success('Course approved successfully');
      fetchCourses();
    } catch (error) {
      toast.error('Failed to approve course');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full bg-gray-700 text-white px-4 py-2 pl-10 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course: any) => (
          <div key={course.id} className="bg-gray-700 rounded-lg overflow-hidden">
            <img
              src={course.thumbnail || '/default-course.jpg'}
              alt={course.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-white font-semibold mb-2">{course.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{course.description}</p>
              <div className="flex justify-between items-center">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    course.isDismissed
                      ? 'bg-red-900 text-red-300'
                      : 'bg-green-900 text-green-300'
                  }`}
                >
                  {course.isDismissed ? 'Dismissed' : 'Active'}
                </span>
                {course.isDismissed ? (
                  <button
                    onClick={() => handleApproveCourse(course.id)}
                    className="flex items-center text-green-500 hover:text-green-400"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approve
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const reason = prompt('Enter dismissal reason:');
                      if (reason) handleDismissCourse(course.id, reason);
                    }}
                    className="flex items-center text-red-500 hover:text-red-400"
                  >
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}