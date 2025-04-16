// 'use client';

// import { useState, useEffect } from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import Progress from '@/components/ui/Progress';
// import StudentService from '@/services/student.service';
// import toast from 'react-hot-toast';
// import { EnrolledCourse } from '@/types/api';



// export default function EnrolledCourses() {
//   const [courses, setCourses] = useState<EnrolledCourse[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchEnrolledCourses();
//   }, []);

//   const fetchEnrolledCourses = async () => {
//     try {
//       setLoading(true);
//       const response = await StudentService.getEnrolledCourses();
//       if (response.success) {
//         setCourses(response.data);
//       } else {
//         toast.error('Failed to fetch enrolled courses');
//       }
//     } catch (error) {
//       console.error('Error fetching enrolled courses:', error);
//       toast.error('Failed to fetch enrolled courses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return <div className="flex justify-center p-8">Loading...</div>;
//   }

//   if (courses.length === 0) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-400">You haven't enrolled in any courses yet.</p>
//         <Link 
//           href="/courses" 
//           className="text-red-500 hover:text-red-400 mt-2 inline-block"
//         >
//           Browse Courses
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <h2 className="text-2xl font-bold text-white">My Enrolled Courses</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {courses.map((course) => (
//           <div 
//             key={course.id} 
//             className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
//           >
//             <div className="relative h-48">
//               <Image
//                 src={course.thumbnail || '/default-course-thumbnail.jpg'}
//                 alt={course.name}
//                 fill
//                 className="object-cover"
//               />
//             </div>
//             <div className="p-4 space-y-4">
//               <div className="flex items-center space-x-2">
//                 <Image
//                   src={course.educatorPfp || '/default-avatar.jpg'}
//                   alt={course.educatorName}
//                   width={32}
//                   height={32}
//                   className="rounded-full"
//                 />
//                 <span className="text-gray-300">{course.educatorName}</span>
//               </div>
//               <h3 className="text-xl font-semibold text-white">{course.name}</h3>
//               <div className="space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-400">Progress</span>
//                   <span className="text-gray-300">{Math.round(course.completionRate)}%</span>
//                 </div>
//                 <Progress value={course.completionRate} className="h-2" />
//               </div>
//               <Link 
//                 href={`/courses/${course.id}`}
//                 className="block text-center bg-red-600 hover:bg-red-700 text-white py-2 rounded-md mt-4"
//               >
//                 Continue Learning
//               </Link>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

