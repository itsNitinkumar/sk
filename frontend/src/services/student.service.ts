import axios from 'axios';
import authService from './auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class StudentService {
  private getHeaders() {
    const token = authService.getAccessToken();
    console.log('Using token:', token ? 'Present' : 'Missing'); // Debug log
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  async getEnrolledCourses() {
    try {
      console.log('Fetching enrolled courses from:', `${API_URL}/student/enrolledCourses`); // Debug log
      const response = await axios.get(`${API_URL}/student/enrolledCourses`, {
        headers: this.getHeaders(),
        withCredentials: true
      });
      console.log('Enrolled courses response:', response.data); // Debug log
      return response.data;
    } catch (error: any) {
      console.error('Detailed error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      throw error;
    }
  }
}

export default new StudentService();



