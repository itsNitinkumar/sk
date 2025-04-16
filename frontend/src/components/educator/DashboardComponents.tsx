
import { ReactNode } from 'react';
import { Course, Doubt } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface DashboardProps {
  courses: Course[];
  onCreateCourse: (courseData: Course) => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function EducatorDashboard({ 
  courses, 
  onCreateCourse,
  onEditCourse, 
  onDeleteCourse, 
  isLoading = false,
  error = null 
}: DashboardProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Your Courses</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse bg-gray-800 h-64 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Your Courses</h1>
        <button
          onClick={() => router.push('/educator/course/create')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Create New Course
        </button>
      </div>
      
      {error && (
        <div className="text-center text-red-500 p-4 bg-red-100 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}

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
            <CourseCard
              key={course.id}
              course={course}
              onEdit={() => onEditCourse(course)}
              onDelete={() => onDeleteCourse(course.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface CourseCardProps {
  course: Course;
  onEdit: () => void;
  onDelete: () => void;
}

const DoubtsModal = ({ doubts, onClose }: DoubtsModalProps) => {
  const answeredDoubts = doubts.filter(doubt => doubt.status === 'resolved');
  const unansweredDoubts = doubts.filter(doubt => doubt.status !== 'resolved');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Course Doubts</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Unanswered Doubts Section */}
          <div>
            <h3 className="text-xl font-semibold text-red-500 mb-4">
              Unanswered Doubts ({unansweredDoubts.length})
            </h3>
            <div className="space-y-4">
              {unansweredDoubts.map(doubt => (
                <div key={doubt.id} className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-white">{doubt.title}</h4>
                  <p className="text-gray-300 mt-2">{doubt.description}</p>
                  <div className="mt-2 text-sm text-gray-400">
                    <span>Status: {doubt.status}</span>
                    <span className="ml-4">
                      Posted: {new Date(doubt.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Answered Doubts Section */}
          <div>
            <h3 className="text-xl font-semibold text-green-500 mb-4">
              Answered Doubts ({answeredDoubts.length})
            </h3>
            <div className="space-y-4">
              {answeredDoubts.map(doubt => (
                <div key={doubt.id} className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-white">{doubt.title}</h4>
                  <p className="text-gray-300 mt-2">{doubt.description}</p>
                  <div className="mt-2 text-sm text-gray-400">
                    <span>Status: {doubt.status}</span>
                    <span className="ml-4">
                      Posted: {new Date(doubt.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DoubtsModalProps {
  doubts: Doubt[];
  onClose: () => void;
}

export function CourseCard({ course, onEdit, onDelete }) {
  const [showDoubts, setShowDoubts] = useState(false);
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleViewDoubts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/v1/doubts/course/${course.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch doubts');
      }
      
      const data = await response.json();
      setDoubts(data.doubts);
      setShowDoubts(true);
    } catch (error) {
      console.error('Error fetching doubts:', error);
      toast.error('Failed to fetch doubts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <img
        src={course.thumbnail || '/default-course-thumbnail.jpg'}
        alt={course.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white mb-2">{course.name}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-white font-semibold">${course.price}</span>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="text-blue-400 hover:text-blue-300"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="text-red-400 hover:text-red-300"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={handleViewDoubts}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
          ) : null}
          View Doubts
        </button>
        
        {/* Existing edit/delete buttons */}
      </div>

      {/* Doubts Modal */}
      {showDoubts && (
        <DoubtsModal 
          doubts={doubts} 
          onClose={() => setShowDoubts(false)} 
        />
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
}

export function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400">{title}</h3>
        <div className="text-red-500">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}














