'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import courseService from '@/services/course.service';
import educatorService from '@/services/educator.service';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export default function CreateCoursePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [courseData, setCourseData] = useState({
    name: '',
    description: '',
    about: '',
    price: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Get educator profile first
      const educatorResponse = await educatorService.getEducatorProfile();
      if (!educatorResponse.success) {
        throw new Error('Failed to fetch educator profile');
      }

      const educatorId = educatorResponse.data.id;
      
      // Create the course
      const response = await courseService.createCourse(educatorId, {
        body: courseData
      });

      if (response.success) {
        toast.success('Course created successfully');
        router.push('/educator');
      } else {
        throw new Error(response.message || 'Failed to create course');
      }
    } catch (error: any) {
      console.error('Error creating course:', error);
      toast.error(error.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Course</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Course Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={courseData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              placeholder="Enter course name"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Short Description
            </label>
            <textarea
              id="description"
              name="description"
              value={courseData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              placeholder="Enter a short description"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="about" className="block text-sm font-medium mb-2">
              About Course
            </label>
            <textarea
              id="about"
              name="about"
              value={courseData.about}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              placeholder="Enter detailed information about the course"
              rows={5}
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-2">
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={courseData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              placeholder="Enter course price"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Course'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}