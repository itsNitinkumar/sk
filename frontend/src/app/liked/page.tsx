// 'use client';

// import { Heart } from 'lucide-react';
// import CourseCard from '@/components/CourseCard';
// import { Course } from '@/types';

// export default function LikedCourses() {
//   const likedCourses: Course[] = [
//     {
//       id: '1',
//       title: 'Advanced JavaScript Patterns',
//       instructor: 'Sarah Wilson',
//       thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a',
//       price: 79.99,
//       rating: 4.9,
//       students: 2345,
//       description: 'Master advanced JavaScript patterns and concepts',
//       preview_url: 'https://example.com/preview1.mp4'
//     },
//     {
//       id: '2',
//       title: 'React Performance Optimization',
//       instructor: 'Mike Chen',
//       thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2',
//       price: 89.99,
//       rating: 4.7,
//       students: 1890,
//       description: 'Learn to build high-performance React applications',
//       preview_url: 'https://example.com/preview2.mp4'
//     }
//   ];

//   return (
//     <div className="ml-64 p-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex items-center mb-6">
//           <Heart className="w-6 h-6 text-red-600 mr-2" />
//           <h1 className="text-2xl font-bold text-white">Liked Courses</h1>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {likedCourses.map((course) => (
//             <CourseCard key={course.id} course={course} />
//           ))}
//         </div>

//         {likedCourses.length === 0 && (
//           <div className="text-center py-12">
//             <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
//             <h2 className="text-xl font-semibold text-white mb-2">No liked courses yet</h2>
//             <p className="text-gray-400">
//               Start exploring courses and like the ones you're interested in!
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }