'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Book, Award, Activity } from 'lucide-react';
import CourseCard from '@/components/CourseCard';

export default function DashboardPage() {
  const [activeCourses, setActiveCourses] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
    </div>
  );
}

