import { Course } from '@/types';
import { useRouter } from 'next/navigation';

interface CourseListItemProps {
  course: Course;
}

export const CourseListItem = ({ course }: CourseListItemProps) => {
  const router = useRouter();
  
  return (
    <button
      onClick={() => router.push(`/content/module/${course.id}`)}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
    >
      Manage Modules
    </button>
  );
};

