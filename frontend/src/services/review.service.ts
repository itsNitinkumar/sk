import axios from 'axios';
import authService from './auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class ReviewService {
  private getHeaders() {
    return {
      'Authorization': `Bearer ${authService.getAccessToken()}`
    };
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
}

export default new ReviewService();
