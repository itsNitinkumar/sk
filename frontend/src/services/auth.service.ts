import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  success: boolean;
  message: string;
}

class AuthService {
  async login(email: string, password: string) {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
      email,
      password,
    });

    
    if (!response.data.success) {
      throw new Error(response.data.message);
    }
    
    if (response.data.accessToken && response.data.refreshToken) {
      this.setTokens(response.data);
    }
    return response.data
  }

  async signup(signupData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    gender?: string;
    age?: number;
  }) {
    console.log("Sending signup data:", signupData); // Log the data being sent

    const response = await axios.post(`${API_URL}/auth/signup`, signupData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  }

  async verifyOtp(email: string, otp: string) {
    const response = await axios.post<AuthResponse>(`${API_URL}/otp/verify`, {
      email,
      otp,
    });

    if (response.data.accessToken && response.data.refreshToken) {
      this.setTokens(response.data);
    }
    return response.data;
  }

  async refreshToken() {
    try {
    
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) throw new Error('No refresh token found');

      const response = await axios.post<AuthResponse>(`${API_URL}/auth/refreshtoken`, {
        token: refreshToken
      });

      if (response.data.accessToken && response.data.refreshToken) {
        this.setTokens(response.data);
      }
      return response.data;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  async forgotPassword(email: string) {
    try {
      const response = await axios.post(`${API_URL}/auth/forgotpassword`, { email });
      return response; // Return the entire response
    } catch (error: any) {
      console.error('Forgot password error:', error.response || error);
      throw error;
    }
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    try {
      const response = await axios.post(`${API_URL}/auth/resetpassword`, {
        email,
        otp,
        newPassword
      });
      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to reset password'
      };
    }
  }

  async logout() {
    try {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        await axios.post(`${API_URL}/auth/logout`, { refreshToken });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear all auth-related data
      this.clearTokens();
      localStorage.removeItem('user');
      localStorage.removeItem('pendingEducatorRegistration');
      
      // Clear any other app-specific data
      localStorage.removeItem('lastViewedCourse');
      localStorage.removeItem('courseProgress');
      
      // Clear all cookies
      document.cookie.split(";").forEach(cookie => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
      });
    }
  }

  setTokens(data: AuthResponse) {
    document.cookie = `accessToken=${data.accessToken}; path=/`;
    document.cookie = `refreshToken=${data.refreshToken}; path=/`;
  }

  getAccessToken() {
    return this.getCookie('accessToken');
  }

  getRefreshToken() {
    return this.getCookie('refreshToken');
  }

  clearTokens() {
    document.cookie = `accessToken=;expires=${new Date().toUTCString()};path=/`;
    document.cookie = `refreshToken=;expires=${new Date().toUTCString()};path=/`;
  }

  private getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  }

  async validateSession() {
    try {
      const response = await axios.get(`${API_URL}/auth/validate`, {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid session');
      }
      throw error;
    }
  }

  async getProfile() {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${this.getAccessToken()}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  // Setup axios interceptor for automatic token refresh
  setupAxiosInterceptors() {
    // Remove any existing interceptors
    axios.interceptors.request.eject(axios.interceptors.request.handlers[0]);
    axios.interceptors.response.eject(axios.interceptors.response.handlers[0]);

    // Add request interceptor
    axios.interceptors.request.use(
      (config) => {
        // Don't add token for auth endpoints
        if (config.url?.includes('/auth/login') || config.url?.includes('/auth/refreshtoken')) {
          return config;
        }

        const token = this.getAccessToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            console.log('Attempting token refresh...');
            const refreshResult = await this.refreshToken();
            
            if (refreshResult.accessToken) {
              console.log('Token refresh successful, retrying original request');
              originalRequest.headers['Authorization'] = `Bearer ${refreshResult.accessToken}`;
              return axios(originalRequest);
            } else {
              console.log('Token refresh failed, redirecting to login');
              this.clearTokens();
              window.location.href = '/login';
              return Promise.reject(error);
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }
}

const authService = new AuthService();
authService.setupAxiosInterceptors();
export default authService;







