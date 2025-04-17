import axios from 'axios';
import authService from './auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Review {
    id: string;
    user: string;
    avatar: string;
    message: string;
    rating: number;
    courseName: string;
    createdAt: string;
    role: string;
}

class ReviewService {
    private getHeaders() {
        const token = authService.getAccessToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
    async createReview(courseId: string, rating: number, message: string) {
        try {
            const response = await axios.post(`${API_URL}/reviews/create`, {
                courseId,
                rating,
                message
            }, {
                headers: this.getHeaders()
            });

            // Debug log
            console.log('Review response:', response.data);

            return response.data;
        } catch (error) {
            // Enhanced error logging
            if (axios.isAxiosError(error)) {
                console.error('Review creation error:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    requestData: {
                        courseId,
                        rating,
                        message
                    }
                });
            }
            throw error;
        }
    }
    async updateReview(courseId: string, rating: number, message: string) {
        try {
            const response = await axios.put(`${API_URL}/reviews/update/${courseId}`, {
                rating,
                message
            }, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error updating review:', error);
            throw error;
        }
    }
    async deleteReview(courseId: string) {
        try {
            const response = await axios.delete(`${API_URL}/reviews/delete/${courseId}`, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    }
    async getAverageRating(courseId: string) {
        try {
            const response = await axios.get(`${API_URL}/reviews/averagerating/${courseId}`, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching average rating:', error);
            throw error;
        }
    }
    async getCourseReviews(courseId: string) {
        try {
            const response = await axios.get(`${API_URL}/reviews/all/${courseId}`, {
                headers: this.getHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching course reviews:', error);
            throw error;
        }
    }
    async getTopReviews(): Promise<{ success: boolean; reviews: Review[]; error?: string }> {
        try {
            const response = await axios.get<{ success: boolean; reviews: Review[] }>(
                `${API_URL}/reviews/top`,
                { headers: this.getHeaders() }
            );

            return {
                success: true,
                reviews: response.data.reviews || []
            };
        } catch (error) {
            console.error('Error fetching top reviews:', error);
            return {
                success: false,
                reviews: [],
                error: axios.isAxiosError(error) 
                    ? error.response?.data?.message || 'Failed to fetch reviews'
                    : 'Unknown error occurred'
            };
        }
    }
}

export default new ReviewService();


