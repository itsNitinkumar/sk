import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import authService from './auth.service';

const CourseService = {
  // Public methods (available to all users)
  getAllCourses: async () => {
    try {
      const response = await axios.get(`${API_URL}/courses/all`);
      return response.data;
    } catch (error) {
      console.error('Error in getAllCourses:', error);
      throw error;
    }
  },

  getSingleCourse: async (courseId: string) => {
    const response = await axios.get(`${API_URL}/courses/single/${courseId}`);
    return response.data;
  },

  searchCourses: async (query: string) => {
    try {
      const response = await axios.get(`${API_URL}/courses/search?name=${encodeURIComponent(query)}&description=${encodeURIComponent(query)}&about=${encodeURIComponent(query)}`);
      return {
        success: true,
        message: 'Courses searched successfully',
        courses: response.data.courses || []
      };
    } catch (error) {
      console.error('Error searching courses:', error);
      return {
        success: false,
        message: axios.isAxiosError(error) ? error.response?.data?.message : 'Failed to search courses',
        courses: []
      };
    }
  },

  // Access control methods (authenticated users)
  checkCourseOwnership: async (courseId: string) => {
    try {
      const response = await axios.get(`${API_URL}/courses/ownership/${courseId}`, {
        headers: { Authorization: `Bearer ${authService.getAccessToken()}` }
      });
      return response.data;
    } catch (error) {
      return { success: false, isOwner: false };
    }
  },

  checkCourseAccess: async (courseId: string) => {
    try {
      const response = await axios.get(`${API_URL}/courses/access/${courseId}`, {
        headers: { Authorization: `Bearer ${authService.getAccessToken()}` }
      });
      return response.data;
    } catch (error) {
      return { success: false, hasAccess: false };
    }
  },

  // Student methods
  purchaseCourse: async (courseId: string) => {
    const response = await axios.post(
      `${API_URL}/courses/purchase/${courseId}`,
      {},
      { headers: { Authorization: `Bearer ${authService.getAccessToken()}` } }
    );
    return response.data;
  },

  // Educator methods (protected by backend authorization)
  createCourse: async (educatorId: string, courseData: any) => {
    try {
      const token = authService.getAccessToken();
      const response = await axios.post(
        `${API_URL}/courses/create/${educatorId}`, // Update this endpoint to match your backend route
        courseData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Course service error:', error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create course'
      };
    }
  },

  updateCourse: async (courseId: string, courseData: any) => {
    const response = await axios.put(
      `${API_URL}/courses/update/${courseId}`,
      courseData,
      { headers: { Authorization: `Bearer ${authService.getAccessToken()}` } }
    );
    return response.data;
  },

  deleteCourse: async (courseId: string) => {
    const response = await axios.delete(
      `${API_URL}/courses/delete/${courseId}`,
      { headers: { Authorization: `Bearer ${authService.getAccessToken()}` } }
    );
    return response.data;
  },

  getCoursesByEducator: async (educatorId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/courses/educator/${educatorId}`,
        { headers: { Authorization: `Bearer ${authService.getAccessToken()}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching educator courses:', error);
      throw error;
    }
  }
};

export default CourseService;




