
'use client';
 import { Course } from '@/types';
 import courseService from '@/services/course.service';
 import { useEffect, useState } from 'react';
 import { Loader2 } from 'lucide-react';
 import { toast } from 'react-hot-toast';
 import  { CourseCardSkeleton } from '@/components/CourseCardSkeleton';
 import { FollowerPointerCard } from '@/components/ui/following-pointer';
 import Image from 'next/image';
 import Link from 'next/link';
 
 export default function CoursesPage() {
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [courses, setCourses] = useState<Course[]>([]);
 
   useEffect(() => {
     fetchCourses();
   }, []);
 
   const fetchCourses = async () => {
     try {
       setLoading(true);
       const response = await courseService.getAllCourses();
       setCourses(response.courses);
       console.log(response.courses);
     } catch (error) {
       setError('Failed to fetch courses');
       toast.error('Failed to fetch courses');
     } finally {
       setLoading(false);
     }
   };
 
   if (loading) {
     return (
       <div className="container mx-auto px-4 py-8">
         <div className="max-w-7xl mx-auto">
           <h1 className="text-3xl font-bold mb-8 text-white">All Courses</h1>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[...Array(6)].map((_, index) => (
               <CourseCardSkeleton key={index} />
             ))}
           </div>
         </div>
       </div>
     );
   }
 
   if (error) {
     return (
       <div className="container mx-auto px-4 py-8">
         <div className="text-center text-red-500 p-4">
           {error}
         </div>
       </div>
     );
   }
 
   return (
     <div className="container mx-auto px-4 py-8">
       <div className="max-w-7xl mx-auto">
         <h1 className="text-3xl font-bold mb-8 text-white">All Courses</h1>
 
         {courses.length === 0 ? (
           <div className="text-center py-12">
             <p className="text-gray-300 text-lg">No courses available.</p>
           </div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {courses.map((course) => (
               <FollowerPointerCard
               title={
                 <TitleComponent
                   title={course.educatorName || "Anonymous"}
                   avatar={course.educatorPfp || "https://avatar.iran.liara.run/public"}
                 />
               }
             >
               <div className="group relative h-full overflow-hidden rounded-2xl border border-zinc-100 bg-white transition duration-200 hover:shadow-xl">
                 <div className="relative aspect-[16/10] w-full overflow-hidden rounded-tl-lg rounded-tr-lg bg-gray-100">
                   <Image
                     src={course.thumbnail || "/course/placeholder.png"}
                     alt="thumbnail"
                     layout="fill"
                     objectFit="cover"
                     className={`transform object-cover transition duration-200 group-hover:scale-95 group-hover:rounded-2xl`}
                   />
                 </div>
                 <div className="p-4 ">
                   <h2 className="my-4 text-lg font-bold text-zinc-700">
                     {course.name}
                   </h2>
                   <div className='flex flex-col  font-normal text-zinc-500 gap-1'>
                     <p className="text-sm">
                       {course.about}
                     </p>
                     <p className="text-sm font-normal text-zinc-500">
                       {course.description}
                     </p>
                   </div>
                   <div className="mt-10 flex flex-row items-center justify-between">
                     <span className="text-sm text-gray-500">{new Date(course?.start).toLocaleDateString()}</span>
                     <Link href={`/courses/${course.id}`}>
                       <div className="relative z-10 block rounded-sm bg-[#2b0f48] hover:bg-[#2b0f48]/80 px-6 py-2 text-xs font-bold text-white">
                         View
                       </div>
                     </Link>
                   </div>
                 </div>
               </div>
             </FollowerPointerCard>  
               
             ))}
           </div>
         )}
       </div>
     </div>
   );
 } 
  
 const TitleComponent = ({
   title,
   avatar,
 }: {
   title: string;
   avatar: string;
 }) => (
   <div className="flex items-center space-x-2">
     <Image
       src={avatar}
       height="20"
       width="20"
       alt="thumbnail"
       className="rounded-full border-2 border-white"
     />
     <p>{title}</p>
   </div>
 );
