'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import courseService from '@/services/course.service';
import categoryService from '@/services/category.service';
import { Course, Category } from '@/types';
import { FollowerPointerCard } from '@/components/ui/following-pointer';
import Image from 'next/image';
import { CourseCardSkeleton } from '@/components/CourseCard';

interface TitleComponentProps {
  title: string;
  avatar: string;
}

const TitleComponent = ({ title, avatar }: TitleComponentProps) => (
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

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const [results, setResults] = useState<{ courses: Course[], categories: Category[] }>({ 
    courses: [], 
    categories: [] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);

      try {
        const [coursesResponse, categoriesResponse] = await Promise.all([
          courseService.searchCourses(query),
          categoryService.searchCategories(query)
        ]);

        setResults({
          courses: coursesResponse.courses || [],
          categories: categoriesResponse.data || []
        });
      } catch (error) {
        console.error('Search failed:', error);
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-white">Searching...</h1>
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

  const { courses, categories } = results;
  const hasNoResults = courses.length === 0 && categories.length === 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-8">
        Search Results for "{query}"
      </h1>

      {/* Categories Section */}
      {categories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                <h3 className="text-lg font-medium text-white">{category.name}</h3>
                {category.description && (
                  <p className="text-gray-400 mt-2 line-clamp-2">{category.description}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Courses Section */}
      {courses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <FollowerPointerCard
              key={course.id}
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
                    alt={`${course.name} thumbnail`}
                    layout="fill"
                    objectFit="cover"
                    className="transform object-cover transition duration-200 group-hover:scale-95 group-hover:rounded-2xl"
                  />
                </div>
                <div className="p-4">
                  <h2 className="my-4 text-lg font-bold text-zinc-700 line-clamp-2">
                    {course.name}
                  </h2>
                  <div className="flex flex-col font-normal text-zinc-500 gap-1">
                    <p className="text-sm line-clamp-2">{course.about}</p>
                    <p className="text-sm font-normal text-zinc-500 line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                  <div className="mt-10 flex flex-row items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {new Date(course?.start).toLocaleDateString()}
                    </span>
                    <Link href={`/courses/access/${course.id}`}>
                      <div className="relative z-10 block rounded-sm bg-[#2b0f48] hover:bg-[#2b0f48]/80 px-6 py-2 text-xs font-bold text-white transition-colors duration-200">
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

      {hasNoResults && (
        <div className="text-center text-gray-400 py-12">
          <p className="text-xl">No results found for "{query}"</p>
          <p className="mt-2">Try different keywords or check your spelling</p>
        </div>
      )}
    </div>
  );
}


