'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, LogOut, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import courseService from '@/services/course.service';
import categoryService from '@/services/category.service';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    courses: any[];
    categories: any[];
  }>({ courses: [], categories: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const router = useRouter();

  

  useEffect(() => {
    // Fetch categories when component mounts
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAllCategories();
        if (response.success) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      try {
        setIsSearching(true);
        const [coursesResponse, categoriesResponse] = await Promise.all([
          courseService.searchCourses(searchQuery),
          categoryService.searchCategories(searchQuery)
        ]);

        setSearchResults({
          courses: coursesResponse.courses || [],
          categories: categoriesResponse.data || []
        });

        // Redirect to search results page with query parameters
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  function handleLogout() {
      router.push('/logout')
      router.refresh();
  }

  return (
    <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className='rounded-sm bg-gray-700 h-9 w-9 text-white/90 flex justify-center items-center text-xl font-bold'>LS</div>
              <span className="text-white font-semibold">Learn Sphere</span>
            </Link>
          </div>
          
          <div className="flex-1 max-w-2xl mx-12 relative">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses and categories..."
                className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <button 
                type="submit" 
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                disabled={isSearching}
              >
                <Search />
              </button>
            </form>

            {searchQuery && (searchResults.courses.length > 0 || searchResults.categories.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                {searchResults.courses.length > 0 && (
                  <div className="p-2">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Courses</h3>
                    {searchResults.courses.slice(0, 3).map((course) => (
                      <Link
                        key={course.id}
                        href={`/courses/${course.id}`}
                        className="block px-4 py-2 hover:bg-gray-700 rounded"
                      >
                        {course.name}
                      </Link>
                    ))}
                  </div>
                )}
                {searchResults.categories.length > 0 && (
                  <div className="p-2 border-t border-gray-700">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Categories</h3>
                    {searchResults.categories.slice(0, 3).map((category) => (
                      <Link
                        key={category.id}
                        href={`/category/${category.id}`}
                        className="block px-4 py-2 hover:bg-gray-700 rounded"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className='flex items-center gap-4 flex-row'>
              <div>
              {user?.isEducator && (
                <Link 
                  href="/profile" 
                  className="text-white hover:text-gray-300"
                >
                  Educator Profile
                </Link>
              )}

              </div>


            <div className="flex items-center gap-4">
              {user ? (
              <div
                className="relative"
                onMouseLeave={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div
                  onMouseEnter={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-white hover:text-gray-300"
                >
                  <Link 
                    href="/profile"
                    className="bg-[#FF6B6B] text-white px-4 py-2 rounded-full hover:bg-[#FF5252] transition-colors"
                  >
                    {user.email[0].toUpperCase()}
                  </Link>
                </div>
                
                <div className='absolute right-0 w-48 pb-4'>
                  {isMenuOpen && (
                    <div className="absolute right-0 w-48 m-2 bg-gray-800 rounded-lg shadow-lg py-3">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                        onClick={() => setIsMenuOpen(false)}
                      >
                         Profile
                      </Link>
                      
                      {user?.isEducator ? (
                        // Educator sees "Courses Taught"
                        <Link
                          href="/educator"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Courses Taught
                        </Link>
                      ) : (
                        // Students see "My Courses"
                        <Link
                          href="/enrolledCourses"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          My Courses
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleLogout();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                </div>
              ) : (
                <Link 
                  href="/login" 
                  className="bg-[#FF6B6B] text-white px-4 py-2 rounded-md hover:bg-[#FF5252] transition-colors"
                >
                  Login
                </Link>
              )}

            
          </div>

        </div>
        </div>
      </nav>
  )
}



