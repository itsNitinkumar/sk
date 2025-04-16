'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Share2, BookOpen, MessageCircle } from 'lucide-react';
import VideoPlayer from '@/components/VideoPlayer';
import CommentSection from '@/components/CommentSection';
import ChatBox from '@/components/ChatBox';
import DoubtForm from '@/components/DoubtForm';
import DoubtDetails from '@/components/DoubtDetails';

export default function WatchCourse({ params }: { params: { courseId: string } }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

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

  const comments = [
    {
      id: '1',
      user: 'Alex Johnson',
      content: 'This course is exactly what I needed to level up my development skills!',
      likes: 24,
      timestamp: '2 days ago'
    },
    {
      id: '2',
      user: 'Maria Garcia',
      content: 'The instructor explains complex concepts very clearly. Highly recommended!',
      likes: 18,
      timestamp: '1 day ago'
    }
  ];

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
      </div>

      <ChatBox
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        instructorName={course.instructor}
      />
    </div>
  );
}
