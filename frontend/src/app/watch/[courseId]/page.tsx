'use client';

import { useState, useMemo } from 'react';
import { ThumbsUp, ThumbsDown, Share2, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import VideoPlayer from '@/components/VideoPlayer';
import CommentSection from '@/components/CommentSection';
import ChatBox from '@/components/ChatBox';
import { motion } from 'framer-motion';

const TestimonialCard = ({ testimonial }: { testimonial: any }) => {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [hasImageError, setHasImageError] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const showInitials = !testimonial.avatar || hasImageError || isImageLoading;

  return (
    <motion.div
      className="bg-[#1A1A1A] rounded-lg p-6 text-white hover:bg-[#2A2A2A] transition-colors relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-4">
        <div className="relative w-12 h-12">
          {showInitials ? (
            <div className="w-12 h-12 rounded-full bg-[#FF6B6B] flex items-center justify-center text-white font-semibold">
              {getInitials(testimonial.user)}
            </div>
          ) : (
            <div className="relative w-12 h-12">
              <Image
                src={testimonial.avatar}
                alt={testimonial.user}
                width={48}
                height={48}
                className="rounded-full object-cover"
                onLoadingComplete={() => setIsImageLoading(false)}
                onError={() => {
                  setHasImageError(true);
                  setIsImageLoading(false);
                }}
                loading="eager"
              />
            </div>
          )}
        </div>
        <div>
          <h4 className="text-white font-semibold">{testimonial.user}</h4>
          <p className="text-[#FF6B47]">{testimonial.role}</p>
          <p className="text-gray-300 mt-4">{testimonial.content}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function WatchCourse({ params }: { params: { courseId: string } }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'rating', etc.

  // Dummy data - replace with actual API call
  const course = {
    id: params.courseId,
    title: 'Advanced Web Development Masterclass',
    instructor: 'Jane Smith',
    price: 129.99,
    description: 'Master modern web development with this comprehensive course covering React, Node.js, and more.',
    videoUrl: 'https://example.com/preview.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    isPurchased: true
  };

  const testimonials = [
    {
      id: '1',
      user: 'Alex Johnson',
      content: 'This course is exactly what I needed to level up my development skills!',
      likes: 24,
      timestamp: '2 days ago',
      avatar: null, // Remove avatar URL to show initials
      role: 'Student'
    },
    {
      id: '2',
      user: 'Maria Garcia',
      content: 'The instructor explains complex concepts very clearly. Highly recommended!',
      likes: 18,
      timestamp: '1 day ago',
      avatar: null, // Remove avatar URL to show initials
      role: 'Developer'
    }
  ];

  const sortedTestimonials = useMemo(() => {
    return [...testimonials].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      if (sortBy === 'rating') {
        return b.likes - a.likes;
      }
      return 0;
    });
  }, [testimonials, sortBy]);

  return (
    <div className="ml-64 p-6">
      <div className="max-w-6xl mx-auto">
        <VideoPlayer videoUrl={course.videoUrl} title={course.title} />
        
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-white">
              <ThumbsUp className="w-6 h-6" />
              <span>1.2K</span>
            </button>
            <button className="flex items-center space-x-2 text-white">
              <ThumbsDown className="w-6 h-6" />
              <span>24</span>
            </button>
            <button className="flex items-center space-x-2 text-white">
              <Share2 className="w-6 h-6" />
              <span>Share</span>
            </button>
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center space-x-2 text-white"
            >
              <MessageCircle className="w-6 h-6" />
              <span>Chat</span>
            </button>
          </div>
        </div>

        <div className="mt-6 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-2">{course.title}</h2>
          <p className="text-gray-300 mb-4">{course.description}</p>
          <div className="flex items-center text-gray-400">
            <span className="mr-4">Instructor: {course.instructor}</span>
          </div>
        </div>

        <CommentSection comments={comments} />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>

      <ChatBox
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        instructorName={course.instructor}
      />
    </div>
  );
}





