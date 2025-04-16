import axios from 'axios';
import authService from './auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

class DoubtService {
  private getHeaders() {
    const token = authService.getAccessToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async createDoubt(courseId: string, title: string, description: string) {
    try {
      console.log('Creating doubt with:', { courseId, title, description });
      // Remove the duplicate api/v1 from the URL
      const response = await axios.post(`${API_URL}/doubts/create`, {
        courseId,
        title,
        description
      }, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating doubt:', error);
      if (axios.isAxiosError(error)) {
        console.log('Error response:', error.response?.data);
        // Return a structured error response
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to create doubt'
        };
      }
      throw error;
    }
  }

  async getDoubtsByCourse(courseId: string) {
    try {
      if (!courseId) {
        throw new Error('Course ID is required');
      }

      const requestUrl = `${API_URL}/doubts/course/${courseId}`;
      console.log('Making request to:', requestUrl);

      const response = await axios.get(requestUrl, {
        headers: this.getHeaders(),
        withCredentials: true
      });

      return {
        success: true,
        doubts: response.data.doubts || [],
        message: response.data.message
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios Error Details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        });
        
        return {
          success: false,
          doubts: [],
          message: error.response?.data?.message || 'Failed to fetch doubts',
          error: error.response?.data
        };
      }
      return {
        success: false,
        doubts: [],
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  }

  async replyToDoubt(doubtId: string, content: string) {
    try {
      const response = await axios.post(
        `${API_URL}/doubts/reply/${doubtId}`,
        { content: content.trim() },
        {
          headers: this.getHeaders(),
          withCredentials: true
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error replying to doubt:', error);
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          message: error.response?.data?.message || 'Failed to reply to doubt'
        };
      }
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  }

  async getDoubtById(doubtId: string) {
    try {
      const response = await axios.get(`${API_URL}/doubts/${doubtId}`, {
        headers: this.getHeaders(),
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching doubt:', error);
      return {
        success: false,
        message: 'Failed to fetch doubt details'
      };
    }
  }

  async getMessages(doubtId: string) {
    try {
      const url = `${API_URL}/doubts/${doubtId}/messages`;
      console.log('Fetching messages from:', url); // Add this debug log
      
      const response = await axios.get(url, {
        headers: this.getHeaders(),
        withCredentials: true
      });
      
      console.log('Messages response:', response.data); // Add this debug log
      return {
        success: true,
        messages: response.data.messages || []
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error details:', {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data,
          headers: error.config?.headers
        });
      }
      return {
        success: false,
        messages: [],
        message: 'Failed to fetch messages'
      };
    }
  }
}

// Export a single instance with all methods
export default new DoubtService();



