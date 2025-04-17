'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Star, Edit2, Trash2 } from 'lucide-react';
import { Review } from '@/types';
import reviewService from '@/services/review.service';
import { toast } from 'react-hot-toast';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ReviewFormData {
    rating: number;
    message: string;
}

export default function CourseReviews({ courseId }: { courseId: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [userReview, setUserReview] = useState<Review | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<ReviewFormData>({
        rating: 5,
        message: ''
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        damping: 15,
        stiffness: 30
    });

    // Create fixed transforms for even and odd indices
    const evenTransform = useTransform(
        smoothProgress,
        [0, 1],
        [0, -50]
    );

    const oddTransform = useTransform(
        smoothProgress,
        [0, 1],
        [0, 50]
    );

    useEffect(() => {
        fetchReviews();
    }, [courseId]);

    const fetchReviews = async () => {
        try {
            const response = await reviewService.getCourseReviews(courseId);
            setReviews(response.reviews);
            const userReview = response.reviews.find((review: Review) => review.isOwner);
            if (userReview) {
                setUserReview(userReview);
            }
        } catch (error) {
            toast.error('Failed to load reviews');
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && userReview) {
                const response = await reviewService.updateReview(
                    courseId,
                    formData.rating,
                    formData.message
                );
                setUserReview(response.review);
                toast.success('Review updated successfully');
            } else {
                try {
                    const response = await reviewService.createReview(
                        courseId,
                        formData.rating,
                        formData.message
                    );
                    setUserReview(response.review);
                    toast.success('Review submitted successfully');
                } catch (error: any) {
                    if (error.response?.status === 400) {
                        const existingReview = error.response.data.existingReview;
                        setUserReview(existingReview);
                        setFormData({
                            rating: existingReview.rating,
                            message: existingReview.message
                        });
                        setIsEditing(true);
                        toast('✏️ Review already created. You can update it now.', {
                            duration: 4000
                        });
                    } else if (error.response?.data?.message?.includes('must purchase')) {
                        toast.error('Please purchase this course to leave a review');
                    } else {
                        toast.error('Review already created. You can update it now.');
                    }
                    return;
                }
            }
            setIsEditing(false);
            fetchReviews();
        } catch (error) {
            toast.error('Review already created. You can update it now.');
        }
    };

    const handleDeleteReview = async () => {
        if (!userReview) return;
        try {
            await reviewService.deleteReview(courseId);
            setUserReview(null);
            toast.success('Review deleted successfully');
            fetchReviews();
        } catch (error) {
            toast.error('Failed to delete review');
        }
    };

    return (
        <div className="space-y-6">
            {/* Review Form */}
            {(!userReview || isEditing) && (
                <form onSubmit={handleSubmitReview} className="space-y-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6 rounded-xl border border-purple-500/20">
                    <div>
                        <label className="block mb-2 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                    className={`text-3xl transition-all duration-200 transform hover:scale-110 ${
                                        star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block mb-2 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Review</label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full p-3 border border-purple-500/20 rounded-lg bg-white/5 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                            rows={4}
                            required
                            placeholder="Share your thoughts about this course..."
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transform transition-all duration-200 hover:scale-105 focus:ring-2 focus:ring-purple-500/20"
                    >
                        {isEditing ? 'Update Review' : 'Submit Review'}
                    </button>
                </form>
            )}

            {/* User's Review */}
            {userReview && !isEditing && (
                <div className="border border-purple-500/20 p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, index) => (
                                    <Star
                                        key={index}
                                        className={`w-6 h-6 ${
                                            index < userReview.rating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className="mt-3 text-gray-200">{userReview.message}</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setFormData({
                                        rating: userReview.rating,
                                        message: userReview.message
                                    });
                                    setIsEditing(true);
                                }}
                                className="text-purple-400 hover:text-purple-300 transition-colors"
                            >
                                <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={handleDeleteReview}
                                className="text-pink-400 hover:text-pink-300 transition-colors"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Enhanced Reviews List */}
            <div ref={containerRef} className="space-y-4">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">All Reviews</h3>
                {reviews
                    .filter(review => !review.isOwner)
                    .map((review, index) => (
                        <motion.div
                            key={review.id}
                            className="border border-purple-500/20 p-6 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                            initial={{ 
                                x: index % 2 === 0 ? -100 : 100,
                                opacity: 0 
                            }}
                            animate={{
                                x: 0,
                                opacity: 1
                            }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1
                            }}
                            style={{
                                y: index % 2 === 0 ? evenTransform : oddTransform
                            }}
                        >
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, index) => (
                                    <Star
                                        key={index}
                                        className={`w-5 h-5 ${
                                            index < review.rating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                        }`}
                                    />
                                ))}
                            </div>
                            <p className="mt-3 text-gray-200">{review.message}</p>
                        </motion.div>
                    ))}
            </div>
        </div>
    );
}














