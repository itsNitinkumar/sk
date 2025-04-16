
'use client';
import { Course, Module } from '@/types';
import courseService from '@/services/course.service';
import educatorService from '@/services/educator.service';
import contentService from '@/services/content.service';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Pencil, Trash2, Plus, MessageCircle, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import doubtService from '@/services/doubt.service';

interface Doubt {
  id: string;
  content: string;
}

export default function EducatorDashboard() {
  const router = useRouter();
  const auth = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCourses, setExpandedCourses] = useState<string[]>([]);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [modules, setModules] = useState<Module[]>([]);
  const [moduleFormData, setModuleFormData] = useState({
    name: '',
    duration: '',
    videoCount: '',
    materialCount: '',
  });
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [showDoubtsModal, setShowDoubtsModal] = useState(false);
  const [selectedDoubtId, setSelectedDoubtId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [activeCourseId, setActiveCourseId] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      if (!auth.user?.id) {
        throw new Error('No user ID found');
      }
      
      const educatorResponse = await educatorService.getEducatorProfile();
      if (!educatorResponse.success) {
        throw new Error('Failed to fetch educator profile');
      }
      
      const educatorId = educatorResponse.data.id;
      const response = await courseService.getCoursesByEducator(educatorId);
      
      if (response.courses) {
        setCourses(response.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses');
      toast.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth.user && !auth.loading) {
      router.push('/login');
      return;
    }

    if (!auth.user?.isEducator && !auth.loading) {
      router.push('/');
      return;
    }

    if (auth.user?.id) {
      fetchCourses();
    }
  }, [auth.user, auth.loading]);

  const handleCreateCourse = () => {
    router.push('/educator/course/create');
  };

  const handleEditCourse = (courseId: string) => {
    router.push(`/educator/courses/edit/${courseId}`);  // Update this path to match your route structure
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      const response = await courseService.deleteCourse(courseId);
      if (response.success) {
        setCourses(courses.filter(course => course.id !== courseId));
        toast.success('Course deleted successfully');
      } else {
        throw new Error(response.message || 'Failed to delete course');
      }
    } catch (error: any) {
      console.error('Error deleting course:', error);
      toast.error(error.message || 'Failed to delete course');
    }
  };

  const handleViewModules = (courseId: string) => {
    router.push(`/content/module/${courseId}`);
  };

  const handleViewDoubts = async (courseId: string) => {
    try {
      setLoading(true);
      console.log('Fetching doubts for courseId:', courseId);
      
      const response = await doubtService.getDoubtsByCourse(courseId);
      console.log('Doubts response:', response);
      
      if (response.success && response.doubts) {
        setDoubts(response.doubts);
        setShowDoubtsModal(true);
      } else {
        console.error('Failed to fetch doubts:', {
          message: response.message,
          error: response.error
        });
        toast.error(response.message || 'Failed to fetch doubts');
      }
    } catch (error) {
      console.error('Error in handleViewDoubts:', error);
      toast.error('An error occurred while fetching doubts');
    } finally {
      setLoading(false);
    }
  };

  const handleReplyToDoubt = (doubtId: string) => {
    setSelectedDoubtId(doubtId);
    setReplyContent('');
  };

  const handleSubmitReply = async (doubtId: string) => {
    if (!replyContent.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    try {
      setLoading(true);
      const response = await doubtService.replyToDoubt(doubtId, replyContent);
      
      if (response.success) {
        toast.success('Reply sent successfully');
        setSelectedDoubtId(null);
        setReplyContent('');
        
        // Update the local doubts state
        setDoubts(prev => prev.map(doubt => 
          doubt.id === doubtId
            ? { 
                ...doubt, 
                status: 'answered',
                message: replyContent.trim()
              }
            : doubt
        ));
      } else {
        toast.error(response.message || 'Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply. Please try again.');
    } finally {
      setLoading(false);
    }
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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Courses Taught</h1>
          <button
            onClick={handleCreateCourse}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Course
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-white mb-2">No courses created yet</h2>
            <p className="text-gray-400">
              Start creating your first course to share your knowledge!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={course.thumbnail || '/default-course-thumbnail.jpg'}
                  alt={course.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{course.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold">${course.price}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCourse(course.id)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewModules(course.id)}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        View Modules
                      </button>
                      <button
                        onClick={() => handleViewDoubts(course.id)}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        View Doubts
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showDoubtsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-lg w-full max-w-4xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Student Doubts</h2>
                <button 
                  onClick={() => setShowDoubtsModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                {doubts.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">
                    No doubts posted for this course yet
                  </p>
                ) : (
                  doubts.map((doubt) => (
                    <div key={doubt.id} className="bg-gray-800 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-white">{doubt.title}</h3>
                      <p className="text-gray-300 mt-2">{doubt.description}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          doubt.status === 'answered' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {doubt.status}
                        </span>
                        {doubt.status !== 'answered' && (
                          <button
                            onClick={() => handleReplyToDoubt(doubt.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                          >
                            Reply
                          </button>
                        )}
                      </div>
                      {selectedDoubtId === doubt.id && (
                        <div className="mt-4">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Type your reply here..."
                            className="w-full bg-gray-700 text-white rounded-lg p-3 min-h-[100px]"
                          />
                          <div className="mt-2 flex justify-end space-x-2">
                            <button
                              onClick={() => setSelectedDoubtId(null)}
                              className="px-4 py-2 text-gray-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSubmitReply(doubt.id)}
                              disabled={loading}
                              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                            >
                              {loading ? 'Submitting...' : 'Submit Reply'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

























