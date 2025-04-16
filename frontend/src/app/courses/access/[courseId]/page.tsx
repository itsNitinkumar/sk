'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import CourseContent from '@/components/CourseContent';
import CourseDoubts from '@/components/CourseDoubts';
import CourseReviews from '@/components/CourseReviews';
import { useState } from 'react';

interface PageProps {
  params: {
    courseId: string;
  };
}

export default function CoursePage({ params }: PageProps) {
  const [currentLesson, setCurrentLesson] = useState<{ id: string } | null>(null);

  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList>
        <TabsTrigger value="content">Content</TabsTrigger>
        <TabsTrigger value="doubts">Doubts</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>

      <TabsContent value="content">
        <CourseContent courseId={params.courseId} />
      </TabsContent>

      <TabsContent value="doubts">
        <CourseDoubts 
          courseId={params.courseId} 
          key={params.courseId} // Add this to force re-render on courseId change
        />
      </TabsContent>

      <TabsContent value="reviews">
        <CourseReviews courseId={params.courseId} />
      </TabsContent>
    </Tabs>
  );
}




